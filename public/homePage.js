"use strict"

//Выход из профиля
const logoutButton = new LogoutButton();
  logoutButton.action = () => {
    ApiConnector.logout(response => {
      if(response.success){
        location.reload();
      }
    })
  }

  //Информация о пользователе
  ApiConnector.current(response => {
    if(response.success){
      ProfileWidget.showProfile(response.data);
    }
  })

//Обновление курса валют
const ratesBoard = new RatesBoard();
const exchangeRates = () => {
  ApiConnector.getStocks(response => {
    if (response.success){
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  });
};
exchangeRates();

setInterval(exchangeRates, 60000);

//Операции с валютой
//Пополнение счета
const moneyManager = new MoneyManager();
  moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
      if (response.success){
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(response.success, 'Пополнение счета успешно!');
      }
      else {
        moneyManager.setMessage(response.succes, response.error);
      }
    })
  }
// Конвертация валют
  moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
      if (response.success){
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(response.success, 'Операция прошла успешно!')
      }
      else {
        moneyManager.setMessage(response.success, response.error)
      }
    })
  }

  moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, 'Перевод выполнен успешно!');
        }
        else {
            moneyManager.setMessage(response.success, response.error);
        }
    });
};

  //Работа с избранным
const favoritesWidget = new FavoritesWidget();
const getFavorites = () => {
    ApiConnector.getFavorites(response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        }
    });
};
getFavorites();

    favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            moneyManager.setMessage(response.success, 'Пользователь добавлен в список!');
            getFavorites();
        }
        else {
            moneyManager.setMessage(response.success, response.error);
        }
    });
};
    favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            moneyManager.setMessage(response.success, 'Пользователь удален из списка!');
            getFavorites();
        }
        else {
            moneyManager.setMessage(response.success, response.error);
        }
    });
};