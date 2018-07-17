import * as express from 'express';
import { deleteRoute } from './deleteRoute';
import { downloadRoute } from './downloadRoute';
import { listAllRoute, listCategoryRoute } from './listRoute';

const router = express.Router();

// allows route functions to contain less error handlers
const catchErrors = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next)
      .catch((err) => {
        if (err.response) {
          err.status = err.response.status;
        }
        next(err);
      });
  };
};

router.get('/list', catchErrors(listAllRoute));
router.get('/list/:category', catchErrors(listCategoryRoute));

router.post('/download', catchErrors(downloadRoute));
// delete all images from specify category
router.post('/delete', catchErrors(deleteRoute));




export default router;
