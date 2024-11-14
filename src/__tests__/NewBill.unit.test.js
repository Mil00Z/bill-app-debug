import { ROUTES_PATH} from "../constants/routes.js";
import router from "../app/Router.js";


describe("Given I am connected as an employee", () => {


  test('Should Have A Defined Router Function',() => {

    expect(ROUTES_PATH).toBeDefined();

  });


  test('Existance of NewBill Path Value',() => {

    const pathTesting = ROUTES_PATH.NewBill

    expect(pathTesting).toBe('#employee/bill/new');
    
  });


});
