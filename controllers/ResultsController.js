app.controller('ResultsController', function($scope) {
    $scope.message = "Results and Success Stories";
    $scope.stories = [
        {
            title: "Jane's Transformation",
            description: "After following our personalized diet plan, Jane lost 20 pounds and gained more energy!"
        },
        {
            title: "Mark's Journey",
            description: "Mark improved his cholesterol levels and overall health by adopting a plant-based diet."
        },
        {
            title: "Emily's Experience",
            description: "Emily learned how to make healthier food choices and now feels more confident in her body."
        }
    ];

    $scope.submitExperience = function() {
        if ($scope.userExperience) {
            alert("Thank you for sharing your experience!");
            $scope.userExperience = ""; // Reset textarea
        } else {
            alert("Please share your experience before submitting.");
        }
    };
});
