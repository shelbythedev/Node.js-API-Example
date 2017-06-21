let express = require('express')

let router = express.Router()

let auth = require('../../lib/private_authentication')

let hub = require('../../functions/private/hub'),
    Device = require('../../functions/private/device')

router.use((req, res, next) => {
    auth.authenticate({ admin_key: req.get('private-key') }, (err, approved) => {
        if (err) return res.status(401).json({ error: err })
        if (approved) next()
    })
})

// Get all devices that have been assigned to any application
router.get('/assigned', (req, res, next) => {
  Hub.assigned((err, hubs) => {
    if (err) return next(new Error(err))
    res.status(200).json(hubs)
  })
})

// Get devices that have not been assigned to an application
router.get('/unassigned', (req, res, next) => {
  Hub.unassigned((err, hubs) => {
    if (err) return next(new Error(err))
    res.status(200).json(hubs)
  })
})

router.post('/', (req, res, next) => {
    Hub.create(req.body, (err, hub) => {
        if (err) next(new Error(err))
        res.status(200).json(hub)
    })
})

router.get('/:id', (req, res, next) => {
  Hub.findById(req.params.id, (err, hub) => {
    if (err) next(new Error(err))
    res.status(200).json(hub)
  })
})

router.put('/:id', (req, res, next) => {
  Hub.update(req.params.id, req.body, (err, hub) => {
    if (err) next(new Error(err))
    res.status(200).json(hub)
  })
})

router.get('/:id/sees', (req, res, next) => {
    Device.findByAtHubId(req.get('app-id'), req.params.id, req.query, (err, devices) => {
        if (err) return next(new Error(err))
        res.status(200).json(devices)
    })
})

router.delete('/:id', (req, res, next) => {
  Hub.destroy(req.params.id, (err) => {
    if (err) return next(new Error(err))
    res.status(410).json({"delete": true})
  })
})

// Unassigns Device from Client and Application
router.put('/:id/unassign', (req, res, next) => {
  Hub.unassign(req.params.id, (err, hub) => {
    if (err) return next(new Error(err))
    res.status(200).json(hub)
  })
})

module.exports = router
