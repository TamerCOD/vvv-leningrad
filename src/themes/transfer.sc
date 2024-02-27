theme: /

    state: Transfer
        TransferWithWorkingHours:
            timeZone = 3
            min = 10:00
            max = 18:00
            stateAvailable = /Transfer/Available
            stateUnavailable = /Transfer/Unavailable

        state: Available
            SetCallResult:
                value = Перевод на оператора
            Answer:
                mode = random
                key = /Перевод/Возможен
            TransferCallToOperator:
                phoneNumber = {{$.session.transferReceiver}}
                timeout = 
        
        state: Unavailable
            Answer:
                mode = random
                key = /Перевод/Невозможен
            go!: /SomethingElseAfterFail

    state: TransferHandler
        event!: transfer
        IsTransferError:
        CounterWithTransition:
            inRow = true
            limit = 2
            key = 
            targetState = /TransferUnavailable
        go!: /Transfer

        state: HangUp
            HangUp:

    state: TransferUnavailable
        SetScenarioAction:
            value = TransferError
        SetCallResult:
            value = Ошибка при переводе
        Answer:
            mode = random
            key = Невозможность перевода
        go!: /SomethingElseAfterFail
