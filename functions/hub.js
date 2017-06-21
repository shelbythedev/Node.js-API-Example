let db = require('../../config/database')

let Hubs = db.model('Hub')

// Return hubs which belong to a customer
let assigned = (callback) => {
  let error = null

  Hubs.find({application_id: {$ne:null}}, (err, hubs) => {
    if (err) error = err
    if (hubs.length === 0) error = "No unassigned hubs"
    return callback(error, hubs)
  })
}

// Return all hubs that have not been assigned to a customer
let unassigned = (callback) => {
  let error = null

  Hubs.find({application_id: null}, (err, hubs) => {
    if (err) error = err
    if (hubs.length === 0) error = "No unassigned hubs"
    return callback(error, hubs)
  })
}

let create = (data, callback) => {
    let error = null

    let hub = new Hubs(data)

    hub.save(err => {
        if (err) error = err
        callback(error, hub)
    })
}

let update = (hubId, data, callback) => {
    let error = null

    Hubs.findOne({ hub_id: hubId }, (err, hub) => {
        if (err) error = 'Hub was not found: ' + err
        if (!hub) error = 'Hub was not found.'
        // if (data.client_id){
            hub.client_id = data.client_id;
        // }
        if (data.application_id){
            hub.application_id = data.application_id;
        }

        if (error != null) callback(error, hub)

        hub.save(err => {
            if (err) error = 'Hub was not saved.'
            callback(error, hub)
        })
    })
}

let findByApplicationId = (applicationId, callback) => {
    let error = null

    Hubs.find({ application_id: applicationId }, (err, hubs) => {
        if (err) error = err
        return callback(error, hubs)
    })
}

let findByClientId = (clientId, callback) => {
    let error = null

    Hubs.find({client_id: clientId}).exec((err, hubs) => {
        if (err) error = err
        if (hubs.length === 0) error = 'No devices assigned to this client'
        return callback(error, hubs)
    })
}

let findById = (hubId, callback) => {
  let error = null

  Hubs.findOne({hub_id: hubId}).exec((err, hub) => {
    if (err) error = err
    if (hub.length === 0) error = 'No hub found'
    return callback(error, hub)
  })
}

let destroyHub = (hubId, callback) => {
  let error = null

  Hubs.remove({hub_id: hubId }, (err, hub) => {
    if (err) error = err
    callback(error, hub)
  })
}

let unassignHub = (hubId, callback) => {
  let error = null

  Hubs.findOne({hub_id: hubId}, (err, hub) => {
    if (err) error = 'Hub was not found: ' + err
    if (!hub) error = 'Hub was not found.'

    hub.application_id = null
    hub.client_id = null

    if (error != null) callback(error, hub)

    hub.save(err => {
        if (err) error = 'Hub was not saved.'
        callback(error, hub)
    })
  })
}


let Hub = {
    assigned: assigned,
    unassigned: unassigned,
    create: create,
    update: update,
    findByApplicationId: findByApplicationId,
    findByClientId: findByClientId,
    findById: findById,
    destroy: destroyHub,
    unassign: unassignHub
}

module.exports = Hub
