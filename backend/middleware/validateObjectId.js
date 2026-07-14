import mongoose from 'mongoose';

const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    // Only validate the specific field this middleware was configured for.
    // Previously fell back through req.body.userId and req.body.itemId regardless
    // of paramName, causing the wrong field to be validated.
    const idToValidate = req.params[paramName] ?? req.body[paramName];

    // We only validate if the ID is present. If it's missing, controller handles it.
    if (idToValidate && !mongoose.Types.ObjectId.isValid(idToValidate)) {
      return res.status(400).json({ success: false, message: `Invalid MongoDB ObjectId format` });
    }

    next();
  };
};

export default validateObjectId;
