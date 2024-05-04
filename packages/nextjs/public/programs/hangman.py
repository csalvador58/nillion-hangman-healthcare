from nada_dsl import *


def nada_main():
    party1 = Party(name="player1")
    player_input = SecretInteger(Input(name="player_input", party=party1))
    my_int1 = SecretInteger(Input(name="stmt_code_1", party=party1))
    my_int2 = SecretInteger(Input(name="stmt_code_2", party=party1))
    my_int3 = SecretInteger(Input(name="stmt_code_3", party=party1))
    my_int4 = SecretInteger(Input(name="stmt_code_4", party=party1))
    my_int5 = SecretInteger(Input(name="stmt_code_5", party=party1))

    is_match1 = player_input - my_int1
    is_match2 = player_input - my_int2
    is_match3 = player_input - my_int3
    is_match4 = player_input - my_int4
    is_match5 = player_input - my_int5

    return [
        Output(is_match1, "my_output1", party1),
        Output(is_match2, "my_output2", party1),
        Output(is_match3, "my_output3", party1),
        Output(is_match4, "my_output4", party1),
        Output(is_match5, "my_output5", party1),
    ]
