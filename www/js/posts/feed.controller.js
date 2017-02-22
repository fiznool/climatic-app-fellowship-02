(function() {
  'use strict';

  angular
    .module('climatic')
    .controller('FeedController', FeedController);

  function FeedController(Posts, $scope, $ionicLoading, $ionicModal, $cordovaCamera, $ionicPlatform) {
    var $ctrl = this;
    $ctrl.title = 'FeedController';
    $ctrl.loadNext = loadNext;
    $ctrl.hasMore = true;
    $ctrl.openModal = openModal;
    $ctrl.newPostData = {
      title: '',
      description: '',
      picture: null
    };
    $ctrl.saveModalData = saveModalData;
    $ctrl.dismissModal = dismissModal;
    $ctrl.addPicture = addPicture;
    $ctrl.removePicture = removePicture;
    $ctrl.refreshFeed = refreshFeed;

    activate();

    ////////////////

    function activate() {
      var modalPromise = $ionicModal.fromTemplateUrl('tmpl/posts/add-post.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: false,
        hardwareBackButtonClose: true
      });
      modalPromise.then(function(modal) {
        $ctrl.modal = modal;
      });

      $ionicLoading.show({
        template: 'Loading...'
      });

      var p = Posts.getPosts();
      p.then(function(res) {
        $ctrl.posts = res.posts;
        $ionicLoading.hide();
      });
    }

    function openModal() {
      $ctrl.modal.show();
    }

    function saveModalData() {
      $ctrl.newPostForm.$setSubmitted();
      if($ctrl.newPostForm.$valid) {
        var p = Posts.savePost($ctrl.newPostData);
        p.then(function(post) {
          $ctrl.modal.hide();
        });
      }
    }

    function dismissModal() {
      $ctrl.modal.hide();
    }

    function addPicture() {
      $ionicPlatform.ready(function() {
        var options = {
          quality: 80,
          destinationType: window.Camera.DestinationType.DATA_URL,
          sourceType: window.Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: window.Camera.EncodingType.JPEG,
          targetWidth: 960,
          saveToPhotoAlbum: false,
          correctOrientation: true
        };
        var p = $cordovaCamera.getPicture(options);
        p.then(function(imageData) {
          $ctrl.newPostData.picture = imageData;
        });
      });
    }

    function removePicture() {
      $ctrl.newPostData.picture = null;
    }

    function loadNext() {
      var p = Posts.getNextPosts();
      p.then(function(res) {
        $ctrl.posts = res.posts;
        $ctrl.hasMore = res.hasMore;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }

    function refreshFeed() {
      var p = Posts.getPosts();
      p.then(function(res) {
        $ctrl.posts = res.posts;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  }
})();
