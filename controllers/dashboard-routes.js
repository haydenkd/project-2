const router = require('express').Router();
const sequelize = require('../config/connection');
const {
    User,
    Flyer,
    ContentType
} = require('../models');
const withAuth = require('../utils/auth');
const helper = require('../utils/helpers');

//GET.findAll====================================================================================
router.get('/', withAuth, (req, res) => {
    Flyer.findAll({
            where: {
                owner_id: req.session.user_id
            },
            include: [{
                    model: User,
                    as: 'owner',
                    attributes: ['email']
                },
                // {
                //     model: User,
                //     as: 'recipient',
                //     attributes: ['email']
                // },
                {
                    model: ContentType,
                    attributes: ['type']
                }
            ]
        })
        .then(dbFlyerData => {
            console.log(dbFlyerData);
            const flyers = dbFlyerData.map(flyer => flyer.get({
                plain: true
            }));
            res.render('dashboard', {
                flyers,
                loggedIn: true,
                helper: helper
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/create', withAuth, (req, res) => {
    res.render('create-flyer');
});

module.exports = router;