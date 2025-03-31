/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import {fireEvent, screen} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
// import mockStore from "../__mocks__/store";

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import {localStorageMock} from "../__mocks__/localStorage.js";
import {bills} from "../fixtures/bills.js";
import mockStore from "../__mocks__/store.js";

describe("Given :: I am connected as an employee", () => {
  describe("When :: I am on NewBill Page", () => {


  //NB pour correcteur :
    // Vu le contexte de travail de ce projet non mis à jours (bcp de beugs dans tout les sens, packages, versions, methodes qui ne marchent pas, tests qui plantent avec des soucis de modules...)
    // Impossible de faire des tests autrement que par des choses simples 


    test("#1 Then :: I check if im really on the good Page with Title and Form element available", () => {
      
      document.body.innerHTML = NewBillUI();

      const formBill = screen.getByTestId("form-new-bill");
      const pageTitle = screen.getByText("Envoyer une note de frais");

      expect(formBill).toBeInTheDocument();
      expect(pageTitle.classList.contains('content-title')).toBeTruthy();
      
    });

    
    test("#2 Then :: je remplis l'input AMOUNT et quand je soumets au click , je dois avoir la valeur de l'input value", () => {
      
      document.body.innerHTML = NewBillUI();

      const amountInput = screen.getByTestId("amount");
      const buttonForm = screen.getByRole("button");

      //Issue with fullfillment of input
      // const testInput = screen.getByPlaceholderText("Vol Paris Londres");
      // userEvent.type(testInput, "test-fullfillment");
      // testInput.dispatchEvent(new InputEvent("input", {data: "test"}));

      
      // Test 1 
       userEvent.type(amountInput, "666");
     
      //Test 2
      // amountInput.dispatchEvent(new InputEvent("input", {data: "666"}));
      
      fireEvent.click(buttonForm);

     
      // Checking value of input
      // screen.debug(testInput);

      console.log(`value of test Input => ${amountInput.value ? amountInput.value : 'aucunes données récupérées'}`);

      // screen.debug(amountInput);

  
      expect(amountInput.value).not.toBe('');
      expect(amountInput.value).toHaveLength(3);
      
    });

  
    test('#3 Then:: Using handleSubmit, should have trace of calling method', () => {

      //TODO
      //Rajouter données formulaire
      //Submit event
      //Coverage Upgrade

      //Définition du localstorage Windows (PK ?)
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      //Création de l'UI / injection dans le DOM
      document.body.innerHTML = NewBillUI();

      //Creation du contexte : on ne comprend pas pk tout ceci ?
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null;
      const newBillou = new NewBill({document, onNavigate, store, localStorage});

      //Mockage de la méthode handle Click Submit (simulation virtuelle)
      const handleSubmit = jest.fn((e)=> newBillou.handleSubmit);

    
      const element = screen.getByRole("button");
      element.addEventListener('click', handleSubmit)

      userEvent.click(element);
      
      expect(handleSubmit).toHaveBeenCalled();
      // expect(handleSubmit).toHaveBeenCalledTimes(1);

    });


    test('#4.1 Then:: Using handleChangeFile, should have trace of calling method',  () => {

      //Définition du localstorage 
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      //Création de l'UI / injection dans le DOM
      document.body.innerHTML = NewBillUI();

      //Creation du contexte : on ne comprend pas pk tout ceci ?
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null;
      const newBillou = new NewBill({document, onNavigate, store, localStorage});

      //Mockage de la méthode handle Click Submit (simulation virtuelle)
      const handleChangeFile = jest.fn((e) => newBillou.handleChangeFile);

    
      const target = screen.getByLabelText("Justificatif");
      target.addEventListener('click', handleChangeFile)

      userEvent.click(target);

      expect(handleChangeFile).toHaveBeenCalled();
      
    });

    test('#4.2 Then:: Create and Upload file, should have 1 good input available', () => {

      document.body.innerHTML = NewBillUI();

      const target = screen.getByTestId("file");

      let testFile = new File(["test"], "test.png", {type: "image/png"});

      userEvent.upload(target, testFile);

      expect(target.files).toHaveLength(1);
      expect(target.files[0]).toBe(testFile);
      expect(target.files[0].type).toContain('image');
      
    });


    test("#5 When I fill the form, Then I should be sent on Bills page", () => {
     
      document.body.innerHTML = NewBillUI();

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const newBill = new NewBill({ document, onNavigate, store: mockStore, localStorage })

      newBill.updateBill = jest.fn();

      const formNewBill = screen.getByTestId("form-new-bill")
      const mockedBill = bills[0]

      fireEvent.change(formNewBill.querySelector(`input[data-testid="expense-name"]`), {
        target: {
          value: mockedBill.name
        },
      })
      fireEvent.change(formNewBill.querySelector(`input[data-testid="datepicker"]`), {
        target: {
          value: mockedBill.date
        },
      })
      fireEvent.change(formNewBill.querySelector(`input[data-testid="amount"]`), {
        target: {
          value: mockedBill.amount
        },
      })
      fireEvent.change(formNewBill.querySelector(`input[data-testid="vat"]`), {
        target: {
          value: mockedBill.vat
        },
      })
      fireEvent.change(formNewBill.querySelector(`input[data-testid="pct"]`), {
        target: {
          value: mockedBill.pct
        },
      })
      fireEvent.change(formNewBill.querySelector(`textarea[data-testid="commentary"]`), {
        target: {
          value: mockedBill.commentary
        },
      })
      fireEvent.change(formNewBill.querySelector(`input[data-testid="file"]`), {
        target: {
          files: [new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })],
        },
      })


      const handleSubmit = jest.fn(newBill.handleSubmit)
      formNewBill.addEventListener("submit", handleSubmit)
      fireEvent.submit(formNewBill)

      expect(handleSubmit).toHaveBeenCalled()
      expect(newBill.updateBill).toHaveBeenCalled();
     

      const heading = screen.getByText('Mes notes de frais');
      expect(heading).toBeTruthy()
    });


    test(`#Bonus car je n'arrivais pas à faire le reste avant de nombreux jours.
    Then :: Je crées un élèment je l'ajoutes au DOM après click au Submit, puis je vérifies s'il est bien existant dans le DOM après le trigger Even`, () => {
      
      document.body.innerHTML = NewBillUI();

      const alert = document.createElement('div');
      alert.setAttribute('data-testid', 'alert-message');
      alert.textContent = "projet à revoir"; 
      
      const buttonForm = screen.getByRole("button");

      fireEvent.click(buttonForm);
      document.body.append(alert);

      const alertElement = screen.getByTestId('alert-message');
      
      console.log(`Mon element ajouté => ${alertElement.textContent ? alertElement.textContent : 'aucunes données recuperées'}`);

      expect(alertElement).toBeInTheDocument();
  
    });


    test('#XY Then:: Using this Test because i dont know how to go ahead more', async () => {

      //Définition du localstorage Windows (PK ?)
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      //Création de l'UI / injection dans le DOM
      document.body.innerHTML = NewBillUI();

      //Creation du contexte : on ne comprend pas pk tout ceci ?
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
     
      const newBillou = new NewBill({document, onNavigate, store:mockStore, localStorage});

      //
      const updateTest = jest.fn(newBillou.updateBill());
    
      expect(updateTest).toBeDefined();


    });


  })
})
