from nada_dsl import *


def nada_main():
    num = 5
    party1 = Party(name="player1")
    player_input = SecretInteger(Input(name="player_input", party=party1))
    
    secrets = []
    for i in range(num):
        secrets.append(SecretInteger(Input(name="stmt_code_" + str(i+1), party=party1)))
        
    results = []
    for i in range(num):
        results.append(Output(player_input - secrets[i], "my_output" + str(i+1), party1))
            
    return results
