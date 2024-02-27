theme: /

    state: Repeat || noContext = true
        intent!: /Повтори
        Repeat:
      

    state: Silence || noContext = true
        event!: speechNotRecognized
        SetCallResult:
            value = Клиент молчал
        SetScenarioAction:
            value = SpeechNotRecognized
        CounterWithTransition:
            inRow = true
            limit = 2
            key = 
            targetState = /Silence/HangUp
        Answer:
            mode = random
            key = /Молчание/Продолжить
        
        state: HangUp
            SetAutomationStatus:
                value = true
            Answer:
                mode = random
                key = /Молчание/Положить трубку
            HangUp:

    state: GlobalFallback || noContext = true
        event!: noMatch
        Repeatable:
        SetCallResult:
            value = Не распознанно
        SetScenarioAction:
            value = NoMatch
        CounterWithTransition:
            inRow = true
            limit = 2
            key = 
            targetState = /GlobalFallback/Transfer
        Answer:
            mode = next
            key = /Глобальный фоллбек продолжить

        state: Transfer
            SetScenarioAction:
                value = NoMatchTransfer
            SetAutomationStatus:
                value = false
            # сохранение в контекст
            go!: /Transfer

    state: NeedOperator || noContext = true
        intent!: /Оператор
        Repeatable:
        SetCallResult:
            value = Просьба соеденить с оператором
        SetScenarioAction
            value = AskForOperator
        if: $.session.lastState === "/HowCanIHelpYou"
            CounterWithTransition:
                inRow = true
                limit = 1
                key = 
                targetState = /NeedOperator/Transfer
            Answer:
                mode = random
                key = /Нужен оператор
        else:
            go!: /NeedOperator/Transfer

        state: Transfer
            SetScenarioAction:
                value = AskForOperatorTransfer
            SetAutomationStatus:
                value = false
            go!: /Transfer
    
    state: Swear || noContext = true
        q!: * $obsceneWord *
        Repeatable:
        SetCallResult:
            value = Клиент ругается
        SetScenarioAction
            value = Swear
        if: $.session.lastState === "/HowCanIHelpYou"
            Answer:
                mode = random
                key = /Мат/МатОдин
        else:
            CounterWithTransition:
                inRow = true
                limit = 1
                key = 
                targetState = /Swear/Transfer
            Answer:
                mode = random
                key = /Мат/МатДва

        state: Transfer
            SetScenarioAction
                value = SwearTransfer
            SetAutomationStatus:
                value = false
            go!: /Transfer

    state: Wrong || noContext = true
        intent!: /Некорректный ответ
        Repeatable:
        SetCallResult:
            value = Некорректный ответ
        SetScenarioAction
            value = Wrong
        SetAutomationStatus: 
            value = false
        Answer:
            mode = random
            key = /Неправильно
    
    state: Spam
        intent!: /Спам
        SetCallResult:
            value = Спам-звонок
        SetScenarioAction
            value = Spam
        Answer:
            mode = random
            key = /Спам
        go!: /GoodBye
        