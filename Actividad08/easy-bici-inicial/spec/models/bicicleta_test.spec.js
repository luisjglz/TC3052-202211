const mongoose = require('mongoose')
const { isReadStream } = require('request/lib/helpers')
const Bicicleta = require('../../models/bicicleta')

describe('Testing bicicletas', function(){
    beforeEach(function(done){
        var mongoDB = 'mongodb://localhost:27017/test'
        mongoose.connect(mongoDB, {useNewUrlParser: true})

        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'connection error'))
        db.once('open', function(){
            //console.log('Connected to the test database')
            done()
        })
    })

    afterEach(function(done){
        Bicicleta.deleteMany({}, function(err, success){
            if(err) console.log(err)
            const db = mongoose.connection
            db.close()
            done()
        })
    })

    //Tests...

    //Checar el createInstance
    describe('Bicicleta.createInstance', ()=>{
        it('crea una instancia de la bicicleta', ()=>{
            let bici = Bicicleta.createInstance(1, 'verde', 'urbana', [19.28, -99.13])

            expect(bici.code).toBe(1)
            expect(bici.color).toBe('verde')
            expect(bici.modelo).toBe('urbana')
            expect(bici.ubicacion[0]).toEqual(19.28)
            expect(bici.ubicacion[1]).toEqual(-99.13)
        })
    });

    //Checar el allBicis
    describe('Bicicleta.allBicis', ()=>{
        it('comienza vacía', (done)=>{
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0)
                done()
            })
        })
    })

    //Add a bike
    describe('Bicicletas.add', ()=>{
        it('agrega una bici', (done)=>{
            let bici = new Bicicleta({code: 1, color: 'verde', modelo: 'urbana'})
            Bicicleta.add(bici, function(err, newBici){
                if(err) console.log(err)
                Bicicleta.allBicis(function(err, bicis){
                    expect(bicis.length).toEqual(1)
                    expect(bicis[0].code).toEqual(bici.code)

                    done()
                })
            })
        })
    })

    //Find by code
    describe('Find a bike by its code', ()=>{
        it('should return bike with code 1', (done)=>{
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0)

                let bici = new Bicicleta({code: 1, color: 'verde', modelo: 'urbana'})
                Bicicleta.add(bici, function(err, newBike){
                    if(err) console.log(err)

                    let bici2 = new Bicicleta({code: 2, color: 'blanca', modelo: 'montaña'})
                    Bicicleta.add(bici2, function(err, newBike){                        
                        if(err) console.log(err)

                        Bicicleta.findByCode(1, function(err, targetBici){
                            expect(targetBici.code).toBe(bici.code)
                            expect(targetBici.color).toBe(bici.color)
                            expect(targetBici.modelo).toBe(bici.modelo)

                            done()
                        })
                    })
                })
            })
        })
    })


    //Remove by code
    describe('Remove a bike by its code', ()=>{
        it('should delete bike with code 1', (done)=>{
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0)

                let bici = new Bicicleta({code: 1, color: 'verde', modelo: 'urbana'})
                Bicicleta.add(bici, function(err, newBike){
                    if(err) console.log(err)
                    Bicicleta.allBicis(function(err, bicis){
                        expect(bicis.length).toBe(1)
                        Bicicleta.removeByCode(1, function(err, cb){
                            Bicicleta.allBicis(function(err, bicis){
                                expect(bicis.length).toBe(0)
                            
                                done()
                            })
                        })
                    })
                })
            })
        })
    })



})
