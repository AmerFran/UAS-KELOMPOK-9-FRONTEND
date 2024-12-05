app.controller('ResultsController', function($scope, AuthService, ResultsService) {
    $scope.message = "Results and Success Stories";
    $scope.stories = [];
    $scope.userExperience = '';
    $scope.editedMessage = '';
    $scope.hasUserStory = false;

    // Fetches current logged-in user
    $scope.getUser = function() {
        return AuthService.getUser();
    };

    // Assign user details to scope
    $scope.user = $scope.getUser();

    // Fetch all stories from the API
    $scope.loadStories = function() {
        ResultsService.loadStories()
            .then(function(response) {
                $scope.stories = response.data.map(function(story) {
                    // Fetch the username based on the user_id (for other users)
                    ResultsService.getUserById(story.user_id)
                        .then(function(userResponse) {
                            // Set the title to the username's journey
                            story.title = `${userResponse.data.username}'s journey`;
                        })
                        .catch(function(error) {
                            console.error('Error fetching username:', error);
                        });

                    return story;
                });

                // Check if the user already has a story
                const userStory = $scope.stories.find(story => story.user_id === $scope.user.id);
                if (userStory) {
                    $scope.hasUserStory = true;
                    $scope.editedMessage = userStory.message;  // Preload the user's message for editing
                } else {
                    $scope.hasUserStory = false;
                }
            })
            .catch(function(error) {
                console.error('Error fetching stories:', error);
            });
    };

    // Submit a new experience
    $scope.submitExperience = function() {
        if ($scope.userExperience) {
            const experienceData = {
                user_id: $scope.user.id,
                message: $scope.userExperience
            };

            ResultsService.submitExperience(experienceData)
                .then(function(response) {
                    // Set the title to the logged-in user's journey
                    response.data.title = `${$scope.user.username}'s journey`;

                    $scope.stories.push(response.data); // Add new story to list
                    $scope.userExperience = ''; // Reset input field
                    $scope.hasUserStory = true; // User now has a story
                })
                .catch(function(error) {
                    console.error('Error submitting experience:', error);
                });
        } else {
            alert("Please share your experience before submitting.");
        }
    };

    // Update an existing experience
    $scope.updateExperience = function() {
        if ($scope.editedMessage) {
            const updatedData = {
                message: $scope.editedMessage
            };

            ResultsService.updateExperience($scope.user.id, updatedData)
                .then(function(response) {
                    // Set the title to the logged-in user's journey
                    response.data.title = `${$scope.user.username}'s journey`;

                    // Find and update the story in the list
                    const index = $scope.stories.findIndex(story => story.user_id === $scope.user.id);
                    if (index !== -1) {
                        $scope.stories[index] = response.data; // Update the message in the list
                    }

                    $scope.hasUserStory = true; // User still has a story, but it was updated
                    $scope.editedMessage = ''; // Reset the input field
                })
                .catch(function(error) {
                    console.error('Error updating experience:', error);
                });
        } else {
            alert("Please provide a new message before updating.");
        }
    };

    // Delete a story
    $scope.deleteStory = function(currId) {
        ResultsService.deleteStory(currId)
            .then(function(response) {
                // Remove the deleted story from the list
                $scope.stories = $scope.stories.filter(story => story.user_id !== $scope.user.id);
                $scope.hasUserStory = false; // user no longer has a story
                $scope.editedMessage = '';
            })
            .catch(function(error) {
                console.error('Error deleting story:', error);
            });
    };

    // Load stories on page load
    $scope.loadStories();
});