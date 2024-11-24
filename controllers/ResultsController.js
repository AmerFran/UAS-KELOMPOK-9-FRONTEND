app.controller('ResultsController', function($scope) {
    $scope.message = "Results and Success Stories";
    $scope.stories = [
        {
            title: "Jane's Transformation",
            description: "After following our personalized diet plan, Jane lost 20 pounds and gained more energy!",
            fullDescription: "Jane followed a personalized plan that helped her achieve significant weight loss and boost her energy levels. She has inspired many others with her journey."
        },
        {
            title: "Mark's Journey",
            description: "Mark improved his cholesterol levels and overall health by adopting a plant-based diet.",
            fullDescription: "By committing to a plant-based diet, Mark significantly improved his cholesterol levels and overall health. His story is a testament to the power of good nutrition."
        },
        {
            title: "Emily's Experience",
            description: "Emily learned how to make healthier food choices and now feels more confident in her body.",
            fullDescription: "Emily adopted healthier eating habits and made significant changes to her lifestyle. As a result, she gained confidence and improved her overall well-being."
        }
    ];

    $scope.isModalVisible = false;
    $scope.selectedStory = {};

    $scope.showDetails = function (story) {
        $scope.selectedStory = story;
        $scope.isModalVisible = true;
    };

    $scope.closeModal = function () {
        $scope.isModalVisible = false;
    };

    $scope.submitExperience = function() {
        if ($scope.userExperience) {
            alert("Thank you for sharing your experience!");
            $scope.userExperience = ""; // Reset textarea
        } else {
            alert("Please share your experience before submitting.");
        }
    };
});
