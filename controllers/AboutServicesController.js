app.controller('AboutServicesController', function($scope, AboutServicesService) {
    // Bind data from the service to the scope
    $scope.aboutTitle = AboutServicesService.aboutTitle;
    $scope.aboutDescription = AboutServicesService.aboutDescription;
    $scope.aboutImage = AboutServicesService.aboutImage;

    $scope.servicesHeading = AboutServicesService.servicesHeading;
    $scope.services = AboutServicesService.services;

    // BMI section data
    $scope.bmiData = AboutServicesService.bmiData;
    $scope.bmiResult = AboutServicesService.bmiResult;
    $scope.bmiCategory = AboutServicesService.bmiCategory;
    $scope.bmiMessage = AboutServicesService.bmiMessage;

    // Function to calculate BMI
    $scope.calculateBMI = function () {
        AboutServicesService.calculateBMI();
        $scope.bmiResult = AboutServicesService.bmiResult;
        $scope.bmiCategory = AboutServicesService.bmiCategory;
        $scope.bmiMessage = AboutServicesService.bmiMessage;
    };

    // Social media links
    $scope.socialLinks = AboutServicesService.socialLinks;
    $scope.copyright = AboutServicesService.copyright;
});