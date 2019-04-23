const router = express.Router();

router.route('/')
    .get((req, res) => {
        res.sendFile("../start.html");
    })

module.exports = router;