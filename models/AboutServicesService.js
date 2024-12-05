app.service('AboutServicesService', function() {
    // About section data
    this.aboutTitle = "Our Goal is to provide you a recipes for healthy foods";
    this.aboutDescription = "Join us on a journey to make healthy eating easy and enjoyable! Our platform offers a wide range of nutritious recipes to suit all tastes and dietary needs. Whether you're enhancing your wellness journey, experimenting with new ingredients, or cooking for your family, we've got you covered. Discover the joy of healthy cooking with us!";
    this.aboutImage = "../assets/image/about.png";

    // Services section data
    this.servicesHeading = "our services";
    this.services = [
        {
            image: "../assets/image/service-1.png",
            title: "Affordable Food",
            description: "Enjoy delicious and healthy meals with our catering service at just $5 per meal.",
            features: [
                "High-quality ingredients at an affordable price",
                "Perfect for events, gatherings, and daily meals",
                "Customizable options to suit your needs",
                "Convenient and hassle-free service"
            ]
        },
        {
            image: "../assets/image/service-3.jpg",
            title: "Variety of Food Choices",
            description: "Explore a wide range of food options to suit every taste and dietary preference.",
            features: [
                "A diverse menu with global cuisines",
                "Options for vegetarian, vegan, gluten-free, and more",
                "Regularly updated menu to keep things exciting",
                "Meals crafted by experienced chefs"
            ]
        }
    ];

    // BMI section logic
    this.bmiData = {
        height: null,
        weight: null,
        age: null,
        gender: null,
    };
    
    this.bmiResult = null;
    this.bmiCategory = "";
    this.bmiMessage = "";

    this.calculateBMI = function () {
        if (this.bmiData.height && this.bmiData.weight && this.bmiData.age && this.bmiData.gender) {
            const heightInMeters = this.bmiData.height / 100;
            this.bmiResult = (
                this.bmiData.weight / (heightInMeters * heightInMeters)
            ).toFixed(2);
    
            // Tentukan kategori BMI
            if (this.bmiResult < 18.5) {
                this.bmiCategory = "Underweight";
            } else if (this.bmiResult < 24.9) {
                this.bmiCategory = "Normal weight";
            } else if (this.bmiResult < 29.9) {
                this.bmiCategory = "Overweight";
            } else {
                this.bmiCategory = "Obesity";
            }
    
            // Tentukan pesan tambahan berdasarkan usia dan jenis kelamin
            if (this.bmiData.age < 18) {
                this.bmiMessage = "Note: BMI calculations may not be accurate for children under 18.";
            } else if (this.bmiData.gender === "female" && this.bmiCategory === "Normal weight") {
                this.bmiMessage = "Great job! Maintaining a healthy BMI is especially beneficial for women's health.";
            } else if (this.bmiData.gender === "male" && this.bmiCategory === "Overweight") {
                this.bmiMessage = "Consider consulting with a healthcare professional about managing weight.";
            } else {
                this.bmiMessage = "Always aim for a balanced diet and regular exercise for optimal health.";
            }
        } else {
            this.bmiResult = null;
            this.bmiCategory = "";
            this.bmiMessage = "";
        }
    };

    // Social media links
    this.socialLinks = [
        {
            url: "https://github.com/AmerFran/KELOMPOK-9-FRONTEND",
            icon: "bxl-github"
        },
        {
            url: "https://www.instagram.com/fabliusm/",
            icon: "bxl-instagram-alt"
        },
        {
            url: "https://x.com/",
            icon: "bxl-twitter"
        },
        {
            url: "https://www.linkedin.com/in/amer-f-337088308/",
            icon: "bxl-linkedin-square"
        }
    ];

    this.copyright = "© Healthy Living | All Rights Reserved";
});
