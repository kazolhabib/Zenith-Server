import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: email === 'admin@example.com' ? 'admin' : 'user',
    });

    if (user) {
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    // Auto-create admin user if they don't exist in the database
    if (!user && email === 'admin@example.com' && password === 'admin123') {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = await User.create({
        name: 'System Admin',
        email,
        password: hashedPassword,
        role: 'admin',
      });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const googleSignIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, image } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      // Create user if they don't exist
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatedPassword, salt);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        image: image || '',
        role: email === 'admin@example.com' ? 'admin' : 'user',
      });
    } else if (image && !user.image) {
      // Update image if they logged in with Google but had no image previously
      user.image = image;
      await user.save();
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req: any, res: Response): Promise<void> => {
  try {
    console.log('Update profile API called. Body:', { name: req.body.name, imageLength: req.body.image ? req.body.image.length : 0 });
    const user = await User.findById(req.user._id);

    if (user) {
      // Allow clearing the image by sending empty string
      user.name = req.body.name || user.name;
      user.image = req.body.image !== undefined ? req.body.image : user.image;

      const updatedUser = await user.save();
      console.log('User updated successfully in DB. Image length:', updatedUser.image ? updatedUser.image.length : 0);

      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        role: updatedUser.role,
        token: generateToken(updatedUser._id.toString()),
      });
    } else {
      console.log('User not found in DB:', req.user._id);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    console.error('Error updating profile in DB:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).json({ message: 'Cannot delete the primary admin user' });
        return;
      }
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
