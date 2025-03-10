const adminOnly = (req, res, next) => {
    const user = req.user; // Assume `req.user` is attached after authentication
  
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  
    next();
  };
  
  module.exports = adminOnly;
  