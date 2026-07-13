import mongoose from 'mongoose';

const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    // Check common places where IDs are passed
    const idToValidate = req.params[paramName] || req.body[paramName] || req.body.userId || req.body.itemId;
    
    // We only validate if the ID is present. If it's missing, controller handles it.
    if (idToValidate && !mongoose.Types.ObjectId.isValid(idToValidate)) {
      return res.status(400).json({ success: false, message: `Invalid MongoDB ObjectId format` });
    }
    
    next();
  };
};

export default validateObjectId;
