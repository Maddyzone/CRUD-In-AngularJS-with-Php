    var listApp = angular.module('listpp', ['ui.bootstrap']);    

    listApp.filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
    });
    /* variable listApp is  a variable which used to control the array values to show the data to show in view  using the module name 'listApp' with arguments as an array */

    /* Initialize the controller by name 'PhoneListCtrl' holds the information of phone in form of array with keys name, snipper, price , quantity */

    /* $scope argument passed in function is a key arguments should be passed with exactly the same name */

    listApp.controller('PhoneListCtrl', function ($scope,$http) {
    $scope.filteredItems =  [];
    $scope.groupedItems  =  [];
    $scope.itemsPerPage  =  3;
    $scope.pagedItems    =  [];
    $scope.currentPage   =  0;

    $scope.phones = [
                        {
                            'name': 'Mexus S',
                            'snippet': 'Fast just got faster with Nexus S.',
                            'price':30,
                            'quantity':50
                        },
                        {
                            'name': 'Samsung Tablet™ with Wi-Fi',
                            'snippet': 'The Next, Next Generation tablet.',
                            'price':30,
                            'quantity':60
                        },
                        {
                            'name': 'Soney Xperia™',
                            'snippet': 'The Next, Next Generation Phone.',
                            'price':30,
                            'quantity':70
                        }
                    ];

    /** Scope argument specify the function by name remove and passed index of list item as a parameter , which splice the list by 1 , as click on remove button **/
            
    $scope.remove = function (index) {
        $scope.phones.splice(index,1);
    }

    $scope.funding = { startingEstimate: 0 };

    $scope.computeNeeded = function() {           
        $scope.needed = $scope.funding.startingEstimate * 10;                
    };


    /** Check if value for funding is 0 or more **/

    $scope.requestFunding = function() {               
        if( $scope.needed == "" || !$scope.needed )
        window.alert("Sorry, please get more customers first.");
    };

    $scope.reset = function() {
        $scope.funding.startingEstimate = 0;
        $scope.needed = 0;
    };

    /** toggleMenu Function to show menu by toggle effect , by default the stage of the menu is false as we click on toggle button, we make it to true or show and reverse on anothe click event. **/

    $scope.menuState = false;
    $scope.add_prod = true;

    $scope.toggleMenu = function() {                
        if($scope.menuState) {                    
            $scope.menuState= false;
        }
        else {
            $scope.menuState= !$scope.menuState.show;
        }
    };

    /** function to get detail of product added in mysql referencing php **/

    $scope.get_product = function(){
    $http.get("db.php?action=get_product").success(function(data)
    {
        //$scope.product_detail = data;   
        $scope.pagedItems = data;    
        $scope.currentPage = 1; //current page
        $scope.entryLimit = 5; //max no of items to display in a page
        $scope.filteredItems = $scope.pagedItems.length; //Initially for no filter  
        $scope.totalItems = $scope.pagedItems.length;

    });
    }
    $scope.setPage = function(pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.filter = function() {
        $timeout(function() { 
            $scope.filteredItems = $scope.filtered.length;
        }, 10);
    };
    $scope.sort_by = function(predicate) {
        $scope.predicate = predicate;
        $scope.reverse = !$scope.reverse;
    };

    /** function to add details for products in mysql referecing php **/

    $scope.product_submit = function() {
        $http.post('db.php?action=add_product', 
            {
                'prod_name'     : $scope.prod_name, 
                'prod_desc'     : $scope.prod_desc, 
                'prod_price'    : $scope.prod_price,
                'prod_quantity' : $scope.prod_quantity
            }
        )
        .success(function (data, status, headers, config) {
          alert("Product has been Submitted Successfully");
          $scope.get_product();

        })

        .error(function(data, status, headers, config){
           
        });
    }

    /** function to delete product from list of product referencing php **/

    $scope.prod_delete = function(index) {  
     var x = confirm("Are you sure to delete the selected product");
     if(x){
      $http.post('db.php?action=delete_product', 
            {
                'prod_index'     : index
            }
        )      
        .success(function (data, status, headers, config) {               
             $scope.get_product();
             alert("Product has been deleted Successfully");
        })

        .error(function(data, status, headers, config){
           
        });
      }else{

      }
    }

    /** fucntion to edit product details from list of product referencing php **/

    $scope.prod_edit = function(index) {  
      $scope.update_prod = true;
      $scope.add_prod = false;
      $http.post('db.php?action=edit_product', 
            {
                'prod_index'     : index
            }
        )      
        .success(function (data, status, headers, config) {    
            //alert(data[0]["prod_name"]);
           
            $scope.prod_id          =   data[0]["id"];
            $scope.prod_name        =   data[0]["prod_name"];
            $scope.prod_desc        =   data[0]["prod_desc"];
            $scope.prod_price       =   data[0]["prod_price"];
            $scope.prod_quantity    =   data[0]["prod_quantity"];


        })

        .error(function(data, status, headers, config){
           
        });
    }

    /** function to update product details after edit from list of products referencing php **/

    $scope.update_product = function() {

        $http.post('db.php?action=update_product', 
                    {
                        'id'            : $scope.prod_id,
                        'prod_name'     : $scope.prod_name, 
                        'prod_desc'     : $scope.prod_desc, 
                        'prod_price'    : $scope.prod_price,
                        'prod_quantity' : $scope.prod_quantity
                    }
                  )
                .success(function (data, status, headers, config) {                 
                  $scope.get_product();
                   alert("Product has been Updated Successfully");
                })
                .error(function(data, status, headers, config){
                   
                });
    }

   
});