from app.calculation import add,subtract,multiply,divide,BankAccount
import pytest

@pytest.fixture()
def zero_bank_account():
    return BankAccount()

@pytest.fixture()
def bank_account():
    return BankAccount(50)

@pytest.mark.parametrize("num1, num2, expected",[
    (3,2,5),
    (4,6,10),
    (9,10,19)
])
def test_add(num1,num2,expected):
    print('testind add function')
    assert add(num1,num2) == expected

def test_subtract():
    assert subtract(9,4) == 5

def test_multiply():
    assert multiply(2,5) == 10

def test_divide():
    assert divide(10,2) == 5

def test_bank_set_initial_amount(bank_account):
    assert bank_account.balance == 50

def test_bank_default_amount(zero_bank_account):
    assert zero_bank_account.balance == 0

def test_withdraw_amount(bank_account):
    bank_account.withdraw(40)
    assert bank_account.balance == 10

def test_collect_interest(bank_account):
    bank_account.collect_interest()
    assert round(bank_account.balance,6) == 55

@pytest.mark.parametrize("deposit,withdraw,expected",[
    (200,100,100),
    (300,100,200)
])
def test_bank_transaction(zero_bank_account,deposit,withdraw,expected):
    zero_bank_account.deposit(deposit)
    zero_bank_account.withdraw(withdraw)
    assert zero_bank_account.balance == expected
