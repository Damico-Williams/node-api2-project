const express = require("express")
const users = require("./data/db")

const router = express.Router()

router.get("/", (req, res) => {
	res.json({
		message: "Welcome to our API",
	})
})

//GET
router.get("/api/posts", (req, res) => {
    users.find()
    .then((posts) =>{
        res.json(posts)
    })
    .catch(() => {
        res.status(500).json({
            error: "The posts information could not be retrieved."
        })
    })
})

//get post by id
router.get("/api/posts/:id", (req, res) => {
    

    users.findById(req.params.id)
    .then((post) => {
        if (!post) {
            return res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
        res.json(post)
    })
    .catch((error) => {
        console.log(error)
        res.status(500).json({
            error: "The post information could not be retrieved."
        })
    })
})

//get comments
router.get("/api/posts/:id/comments", (req, res) => {
    

    users.findPostComments(req.params.id)
    .then((comments) => {
        if (!comments) {
            return res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
        res.json(comments)
    })
    .catch((error) => {
        console.log(error)
        res.status(500).json({
            error: "The post information could not be retrieved."
        })
    })
})

// POST
router.post("/api/posts", (req, res) => {
    if(!req.body.title || !req.body.contents) {
        return res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    }

    users.insert(req.body)
    .then((post) => {
        res.status(201).json(post)
    })
    .catch((error) => {
        console.log(error)
        res.status(500).json({
            error: "There was an error while saving the post to the database"
        })
    })
})

// Post comments
// router.post("/api/posts/:id/comments", (req, res) => {
//     const comment = { post_id: req.params.id, ...req.body };

//     if(!req.body.text) {
//         return res.status(400).json({
//             errorMessage: "Please provide text for the comment."
//         })
//     }

//     users.findById(req.params.id)
//     .then((post) => {
//         console.log(post)
//         if (!post) {
//            return res.status(404).json({
//                 message: "The post with the specified ID does not exist."
//             })
//         }
//         users.insertComment(comment)
//         .then((comment) => {
//         console.log(comment)

//              res.status(201).json(comment)
        
        
//     })
//     })
//     .catch((error) => {
//         console.log(error)
//         res.status(500).json({
//             error: "There was an error while saving the comment to the database"
//         })
//     })
    
// })

router.post("/api/posts/:id/comments", async (req, res) => { 
    try {
        const comment = { post_id: req.params.id, ...req.body };

        if(!req.body.text) {
            return res.status(400).json({
                errorMessage: "Please provide text for the comment."
            })
        }
        const post = await users.findById(req.params.id)
        if (!post) {
            return res.status(404).json({
                 message: "The post with the specified ID does not exist."
             })
         }
         const commentRes = await users.insertComment(comment)
         res.status(201).json(commentRes)
} catch (error) {
    console.log(error)
        res.status(500).json({
            error: "There was an error while saving the comment to the database"
        })
}
    
})

// Delete
router.delete("/api/posts/:id", (req, res) =>{
    
    users.remove(req.params.id)
        .then((count) => {
            if(count > 0) {
                res.status(200).json({
                    message: "Welcome to oblivion"
                })
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                error: "The post could not be removed"
            })
        })
})

// PUT
router.put("/api/posts/:id", (req, res) => {

    

    if(!req.body.title || !req.body.contents) {
        return res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    }

    users.findById(req.params.id)
    .then((post) => {
        console.log(post)
        if (!post) {
            return res.status(404).json({
                 message: "The post with the specified ID does not exist."
                })
            }
    })
    users.update(req.params.id, req.body)
    .then((comm) => {
             res.status(200).json(comm)
    })
    .catch((error) => {
        console.log(error)
        res.status(500).json({
            error: "The post information could not be modified."
        })
    })
})

// export the new router
module.exports = router;