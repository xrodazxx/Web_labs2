import passport from '../../config/passport.js';
const authenticateJWT = passport.authenticate('jwt', { session: false });
export default authenticateJWT;
