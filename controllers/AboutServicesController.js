// AboutServicesController.js
app.controller('AboutServicesController', function($scope) {
    // About section data
    $scope.aboutTitle = "Our Goal is to provide you a recipes for healthy foods";
    $scope.aboutDescription = "Join us on a journey to make healthy eating easy and enjoyable! Our platform offers a wide range of nutritious recipes to suit all tastes and dietary needs. Whether you're enhancing your wellness journey, experimenting with new ingredients, or cooking for your family, we've got you covered. Discover the joy of healthy cooking with us!";
    $scope.aboutImage = "../assets/image/about.png";

    // Services section data
    $scope.servicesHeading = "our services";
    $scope.services = [
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

    //bmi section
    $scope.bmiData = {
        height: null,
        weight: null,
        age: null,
        gender: null,
    };
    
    $scope.bmiResult = null;
    $scope.bmiCategory = "";
    $scope.bmiMessage = "";
    
    $scope.calculateBMI = function () {
        if ($scope.bmiData.height && $scope.bmiData.weight && $scope.bmiData.age && $scope.bmiData.gender) {
            const heightInMeters = $scope.bmiData.height / 100;
            $scope.bmiResult = (
                $scope.bmiData.weight / (heightInMeters * heightInMeters)
            ).toFixed(2);
    
            // Tentukan kategori BMI
            if ($scope.bmiResult < 18.5) {
                $scope.bmiCategory = "Underweight";
            } else if ($scope.bmiResult < 24.9) {
                $scope.bmiCategory = "Normal weight";
            } else if ($scope.bmiResult < 29.9) {
                $scope.bmiCategory = "Overweight";
            } else {
                $scope.bmiCategory = "Obesity";
            }
    
            // Tentukan pesan tambahan berdasarkan usia dan jenis kelamin
            if ($scope.bmiData.age < 18) {
                $scope.bmiMessage = "Note: BMI calculations may not be accurate for children under 18.";
            } else if ($scope.bmiData.gender === "female" && $scope.bmiCategory === "Normal weight") {
                $scope.bmiMessage = "Great job! Maintaining a healthy BMI is especially beneficial for women's health.";
            } else if ($scope.bmiData.gender === "male" && $scope.bmiCategory === "Overweight") {
                $scope.bmiMessage = "Consider consulting with a healthcare professional about managing weight.";
            } else {
                $scope.bmiMessage = "Always aim for a balanced diet and regular exercise for optimal health.";
            }
        } else {
            $scope.bmiResult = null;
            $scope.bmiCategory = "";
            $scope.bmiMessage = "";
        }
    };
    

    // Social media links
    $scope.socialLinks = [
        {
            url: "https://github.com/AmerFran/UAS-KELOMPOK-9-FRONTEND",
            icon: "bxl-github"
        },
        {
            url: "https://www.instagram.com/fabliusm/",
            icon: "bxl-instagram-alt"
        },
        {
            url: "https://x.com/cakequitterie",
            icon: "bxl-twitter"
        },
        {
            url: "https://www.linkedin.com/in/amer-f-337088308/",
            icon: "bxl-linkedin-square"
        }
    ];

    $scope.copyright = "© Healthy Living | All Rights Reserved";
});