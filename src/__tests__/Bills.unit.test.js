import { ROUTES_PATH} from "../constants/routes.js";
import router from "../app/Router.js";



describe("Given I am connected as an employee", () => {

  test('I Have A Defined Router Function',() => {

    expect(ROUTES_PATH).toBeDefined();

  });

    
  test('Existance of NewBill Path Value',() => {

      const pathTesting = ROUTES_PATH.Bills

      expect(pathTesting).toBe('#employee/bills');
      
    });



});
