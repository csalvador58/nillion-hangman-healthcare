from nada_dsl import *


def nada_main():
    num_valid_stmts = 5

    program = Party(name="program")
    player1 = Party(name="player1")
    player_guess = SecretInteger(Input(name="player_guess", party=player1))
    secret_codes = []
    for i in range(num_valid_stmts):
        secret_codes.append(
            SecretInteger(Input(name=f"secret_code_{i}", party=program))
        )
    
    # check if the player's guess is found in array of secret codes
    @nada_fn
    def isStatementCorrect(input) -> Integer:
        result = Integer(0)
        for i in range(num_valid_stmts):
            result = (secret_codes[i] == input).if_else(Integer(1), Integer(0))
        return result

    result = isStatementCorrect(player_guess)

    return [Output(result, "is_code_valid", player1)]
