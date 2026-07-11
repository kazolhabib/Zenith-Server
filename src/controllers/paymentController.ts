import { Response } from 'express';
import Stripe from 'stripe';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';

const getStripeClient = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('Stripe is not configured on the server');
  }

  return new Stripe(secretKey);
};

export const createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stripe = getStripeClient();
    const { planName } = req.body; // 'silver' or 'gold'
    if (!planName || !['silver', 'gold'].includes(planName.toLowerCase())) {
      res.status(400).json({ message: 'Invalid plan selected' });
      return;
    }

    const plan = planName.toLowerCase();
    const amount = plan === 'silver' ? 0 : 4900; // in cents
    const displayName = plan === 'silver' ? 'Silver Club Membership' : 'Gold VIP Membership';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: displayName,
              description: `Elite privileges for Zenith ${displayName}`,
            },
            unit_amount: amount,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      metadata: {
        userId: req.user._id.toString(),
        planName: plan,
      },
    });

    res.status(200).json({ sessionUrl: session.url });
  } catch (error: any) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const verifyCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stripe = getStripeClient();
    const { sessionId } = req.body;
    if (!sessionId) {
      res.status(400).json({ message: 'Session ID is required' });
      return;
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }

    // Check payment status or setup status
    const isPaid = session.payment_status === 'paid' || session.payment_status === 'no_payment_required';
    
    if (isPaid) {
      const userId = session.metadata?.userId;
      const planName = session.metadata?.planName;

      if (userId && planName) {
        const user = await User.findById(userId);
        if (user) {
          user.membership = planName as any;
          await user.save();
          
          // Return updated user (excluding password)
          const updatedUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            membership: user.membership,
            image: user.image
          };
          
          res.status(200).json({ success: true, user: updatedUser });
          return;
        }
      }
    }

    res.status(400).json({ message: 'Payment verification failed' });
  } catch (error: any) {
    console.error('Stripe verification error:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};
