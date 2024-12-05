app.service('ResultsService', function($http) {
    const API = 'http://localhost:3000';

    // Fetches all stories from the API
    this.loadStories = function() {
        return $http.get(API + '/messages');
    };

    // Fetches the username for a particular story
    this.getUserById = function(userId) {
        return $http.get(API + '/users/' + userId);
    };

    // Submit a new experience
    this.submitExperience = function(experienceData) {
        return $http.post(API + '/messages', experienceData);
    };

    // Update an existing experience
    this.updateExperience = function(userId, updatedData) {
        return $http.put(API + '/messages/' + userId, updatedData);
    };

    // Delete a story
    this.deleteStory = function(messageId) {
        return $http.delete(API + '/messages/' + messageId);
    };
});
