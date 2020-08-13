var mongoose = require("mongoose");
var accommodation = require("./models/accommodation");

data = [
    {
        name: "Student Accommodation Consultancy",
        image: "/image1.jpg", 
        address: "46 Dunes, summerstrand",
        phone: "074 318 9302",
        email: "enquiries@studentaccomconsult.co.za",
        description: "For students needing accomodation in the NMMU Summerstrand area you have come to the perfect place. Our friendly team cant wait to meet and assist you! "
    }
];

function test(){
    data.forEach(function(seed){
        accommodation.create(seed, function(err, accommodation){
             if(err){
                console.log(err)
            } else {
                console.log("added accommodation");
            }
        });
        
    });
}

module.exports = test;