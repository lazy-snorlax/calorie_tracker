// Storage Controller
const StorageCtrl = ( function() {
  // Public Methods
  return {
    storeItem: function(item){
      let items = [];
      // Check if any items in local storage
      if(localStorage.getItem('items') === null){
        // If no items; 
        /*      set empty array,
                push onto array,
                setItem to local storage
        */
        items = [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // If some items; 
        /*      get items and set into array, 
                push new item onto array, 
                setItem back into local storage
        */
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items = [];
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    }, 
    updateItemsStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item, index) => {
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item, index) => {
        if(id === item.id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem('items');
    }
  }
})();

// Item Controller
const ItemCtrl = (function(){
  // Item constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  /*** Data Structure ***/
  const data = {
    // items: [
    //   // {id: 0, name:'Steak Dinner', calories: 1200},
    //   // {id: 1, name:'Cookie', calories: 400},
    //   // {id: 2, name:'Hamburger', calories: 1800}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }
  
  // Public methods
  return {
    getItems: function(){
      return data.items;
    },

    addItem: function(name, calories){
      let ID;
      // Create ID
      if (data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },

    getItemByID: function(id) {
      let found = null;
      // Loop through items
      data.items.forEach(item => {
        if (item.id === id){
          found = item;
        }
      });

      return found;
    },

    getTotalCalories: function() {
      let total = 0;

      data.items.forEach(item => {
        total += item.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },

    updateItem: function(name, calories){
      calories = parseInt(calories);
      let found = null;

      data.items.forEach(item => {
        if (item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item
        }
      });
      return found;
    },

    deleteItem: function(id) {
      // Get ids
      const ids = data.items.map((item) => {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove Item
      data.items.splice(index, 1);
    },
    
    clearAllItems: function(){
      data.items = [];
    },

    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },

    logData: function(){
      return data;
    }
  }
})();

/*** UI Controller ***/
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }
  
  // Public methods
  return {
    populateItemList: function(items){
      let html = '';

      items.forEach(item => {
        html += `
        <li id="item-${item.id}" class="collection-item">
          <strong>${item.name}</strong>
          <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>`;
      });

      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    addListItem: function(item){
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      li.id = `item-${item.id}`;      
      // Add HTML
      li.innerHTML = `
        <strong>${item.name}</strong>
        <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
        // Insert item
        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    getSelectors: function() {
      return UISelectors;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    updateTotalCalories: function(total){
      document.querySelector(UISelectors.totalCalories).innerText = total;
    },
    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node List into Array
      listItems = Array.from(listItems);

      listItems.forEach(listItem =>{
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name}</strong>
          <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // Turn node into array
      listItems = Array.from(listItems);

      listItems.forEach(item =>{
        item.remove();
      });
    },

    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    addItemToForm: function(item) {
      document.querySelector(UISelectors.itemNameInput).value = item.name;
      document.querySelector(UISelectors.itemCaloriesInput).value = item.calories;
      UICtrl.showEditState();
    }
  }
})();

/***  App Controller ***/
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
  // Load Event Listeners
  const loadEventListeners =  function() {
    // Get UI Selectors
    UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', (e) => {
      if (e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    
    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    
    // Back Button Event
    document.querySelector(UISelectors.backBtn).addEventListener('click', exitEditState);
    
    // Delete Button Event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
    // Clear Button Event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    
  }

  // Add item submit
  const itemAddSubmit = function(e){    
    //  Get form input from UI
    const input = UICtrl.getItemInput();
    
    // Check for name and calorie input
    if (input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Update UI
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total to UI
      UICtrl.updateTotalCalories(totalCalories);    
      
      // Store in localStorage
      StorageCtrl.storeItem(newItem);

      // Clear input form
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Edit Item Click
  const itemEditClick = function(e){
    if(e.target.classList.contains('edit-item')){
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemByID(id);

      // Set item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm(itemToEdit);
    }
    e.preventDefault();
  }

  // Item Update Submit
  const itemUpdateSubmit = function(e){
    // console.log('update');
    const input = UICtrl.getItemInput();

    // Update Item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Update total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.updateTotalCalories(totalCalories);

    // Update local storage
    StorageCtrl.updateItemsStorage(updatedItem);

    UICtrl.clearEditState();
    e.preventDefault();
  }

  // Item Delete Submit
  const itemDeleteSubmit = function(e) {
    const currentItem = ItemCtrl.getCurrentItem();
    ItemCtrl.deleteItem(currentItem);

    // Delete From UI
    UICtrl.deleteListItem(currentItem.id);

    // Update total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.updateTotalCalories(totalCalories);

    // Delete from Local Storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();    
    e.preventDefault()
  }

  // Exit Edit State
  const exitEditState = function(e) {
    UICtrl.clearEditState();    
    e.preventDefault();
  }

  // Clear All
  const clearAllItemsClick = function(e) {
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total to UI
    UICtrl.updateTotalCalories(totalCalories);

    UICtrl.removeItems();

    // Clear From Local Storage
    StorageCtrl.clearItemsFromStorage();

    UICtrl.hideList();

    e.preventDefault();
  }

  // Public methods
  return {
    init: function(){
      // Set initial state
      UICtrl.clearEditState();

      // Fetch Items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate List with Items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total to UI
      UICtrl.updateTotalCalories(totalCalories); 

      // Load Event Listeners
      loadEventListeners();      
    }
  }

})(ItemCtrl, StorageCtrl, UICtrl);

App.init();