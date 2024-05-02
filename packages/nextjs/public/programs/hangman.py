from nada_dsl import *


def nada_main():
    fail_limit = 4
    num_valid_stmts = 5

    player1 = Party(name="Player1")
    # num_inputs = SecretInteger(Input(name="num_guesses", party=player1))
    # secret_codes = Array(
    #     SecretInteger(Input(name="secret_codes", party=player1)), size=5
    # )

    player_inputs = Array(
        SecretInteger(Input(name="input_blob", party=player1)), size=10
    )

    # @nada_fn
    # def isStatementCorrect(input) -> Integer:
    #     result = Integer(0)
    #     for i in range(num_valid_stmts):
    #         result = (secret_codes[i] == input).if_else(Integer(1), Integer(0))
    #     return result
    return [Output(player_inputs, "my_output", player1)]