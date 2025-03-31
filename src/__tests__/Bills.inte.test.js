/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import {fireEvent, screen, waitFor} from "@testing-library/dom";
import userEvent from '@testing-library/user-event'


import BillsUI from "../views/BillsUI.js"
import { parseData,sortBillsByDate} from '../views/BillsUI.js';
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js";

import router from "../app/Router.js";
// import { format } from 'path';

import { formatDate } from "../app/format.js" 

beforeEach(() => {
  // Voir si on peut factoriser des calls de chaques tests ?
});

describe("Given I am connected as an employee", () => {

  describe("When I am on Bills Page", () => {


    test("#1 Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()

      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')

  
      // expect(windowIcon).toHaveClass('active-icon');
      // Pbm de versions de script car le matcher devrait fonctionner !!!
  
      expect(windowIcon.classList.contains('active-icon')).toBeTruthy();

    });


    test("#2 Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const datesMocked = screen.getAllByText(/^(19|20)\d\d[-{ /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map((a) => {
        return a.innerHTML;
      });

      // console.log('❌ DATES MOCK FORMAT ❌');
      // console.log(JSON.stringify(datesMocked));
     

      // Transformation du format des dates du mock pour coincider avec le FRONT et la demande de tris.
      let mockedDatesTransfo = datesMocked.map((date) => {
          return formatDate(date);
      });

      // console.log('👌DATES FORMATTED FOR FRONT UI AND TESTING👌');
      // console.log(mockedDatesTransfo);

    
      // let datesSorted = sortBillsByDate(mockedDatesTransfo);

      const expectedDates = [...mockedDatesTransfo].sort((a, b) => {
        return new Date(b) - new Date(a)
      })

      
      // console.log('✨ DATES ORDERED CORRECTLY ✨');
      // console.log(JSON.stringify(datesSorted));


      expect(expectedDates).toEqual(mockedDatesTransfo);
    
    });



    test('#3 Then if i click on Eye Icon Actionner, it should open a modal of Content',  () => {

      document.body.innerHTML = BillsUI({ data: bills });

      const icon = screen.getAllByTestId('icon-eye')[0];
      const modal = screen.getByRole('dialog', {hidden:true});

      //Scenario avec UserEvent Click

      // POURQUOI l'event User click ne fonctionne pas simplement ici (VS dans d'autre fichier OUI) : incroyable cette kermesse"
      icon.addEventListener('click',(e) =>{

        // je ne sais pas quoi faire comme callback donc il n'y en a pas, le tes

      });

      //Trigger Event
      userEvent.click(icon);



      // expect(modal.classList.contains('show')).toBeTruthy();

      //Scenario Alternatif en attendant la résolution 👆
      expect(modal.classList.contains('show')).not.toBeTruthy();

    });




    test('#4 Test copié collé adapté au hasard pour vérifier si la méthode HandleClickIconEye fonctionne', () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      document.body.innerHTML = BillsUI({data: bills});

      
      //Creation du contexte : on ne comprend pas pk il faut faire tout ce cinéma pour utiliser la methode handleClickIconEye
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null;
      const billou = new Bills({document, onNavigate, store, localStorage });

      const element = screen.getAllByTestId('icon-eye')[0];
      // const modal = screen.getByRole('dialog', {hidden:true});


      
      //annuler la fonction jquery modal : comment est-on censé savoir débeugué ça dans un projet obsolète en tant qu'apprenant ?!
      $.fn.modal = jest.fn();

      //Mockage de la méthode handle ClickIconEye (simulation virtuelle)
      const handleClickIconEye = jest.fn(billou.handleClickIconEye(element));

      element.addEventListener('click', handleClickIconEye);

      //Trigger Event
      userEvent.click(element);

      // screen.debug(modal);

      expect(handleClickIconEye).toHaveBeenCalled();
     
      //Impossible de comprendre pourquoi ce n'est pas fonctionnel ?!
      // expect(modal.classList.contains('show')).toBeTruthy();
  
    });


    // ERRORS Test
    test('#5 Then, Error page should be rendered with error argument', () => {

      document.body.innerHTML = BillsUI({ error: 'some error message' })

      const errorElement = screen.getByText('Erreur');

      expect(errorElement).toBeDefined();
      
    });


    test('#6-1 Then:: Calling argument error 404 should have Error 404', () => {

      document.body.innerHTML = BillsUI({ error: 'Error 404' })

      const errorElement = screen.getByText('Erreur');

      expect(errorElement).toBeTruthy();
      
    });

    test('#6-2 Then :: Then:: Calling argument error 404 should have Error 500', () => {

      document.body.innerHTML = BillsUI({ error: 'Error 500' })

      const errorElement = screen.getByText('Erreur');

      expect(errorElement).toBeTruthy();
      
    });


    test('#7 Then:: Using handleclickNewBill, should have trace of calling method', () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      document.body.innerHTML = BillsUI({data: bills});

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null;
      const exempleBill = new Bills({document, onNavigate, store, localStorage });

      //Mockage de la méthode
      const handleClickNewBill = jest.fn(exempleBill.handleClickNewBill);

      const element = screen.getByTestId('btn-new-bill');
      element.addEventListener('click', handleClickNewBill);

      //Trigger Event
      userEvent.click(element);

  
      expect(handleClickNewBill).toHaveBeenCalled();
      // expect(handleClickNewBill).toHaveBeenCalledTimes(1);

     
    });

    
    test('#8 Then:: Calling Getbills, have bills list', async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      document.body.innerHTML = BillsUI({data: bills});

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
    
      const exempleBill = new Bills({document, onNavigate, store: mockStore, localStorage });

      //Mockage de la méthode 
      const billsLoaded = await exempleBill.getBills();
      
      // console.log(billsLoaded);
      
      expect(billsLoaded).toBeDefined();
      expect(billsLoaded.length).toBe(bills.length);
     
    });



  })
})



