require: requirements.sc
theme: /

    state: Start
        q!: $regex</start>
        StartCallSession:
        SetTransferReceiverByDefault:
            value = 123456789
        SetScenarioAction:
            value = IncomingCall
        SetAutomationStatus:
            value = false
        go!: /Hello

    state: Hello
        SetCallResult: 
            value = Приветствие
        UtcGreeting:
        go!: /CompanyIntroduction

    state: CompanyIntroduction
        Answer:
            mode = random
            key = Вступление
        go!: /HowCanIHelpYou

    state: HowCanIHelpYou
        Answer:
            mode = random
            key = Как я могу помочь
        intent: /HowCanIHelpYouHello || toState = "/HowCanIHelpYou/Hello", onlyThisState = true
        intentGroup: /KnowledgeBase/FAQ.Офтопик || toState = "/Offtopic"
        intentGroup: /KnowledgeBase/FAQ.FAQ || toState = "/FAQ"
        intentGroup: /KnowledgeBase/FAQ.Перевод на оператора || toState = "/TransferTriggers"

        state: Hello || noContext = true
            Answer:
                mode = random
                key = Как я могу помочь привет


    state: SomethingElse
        SetCallResult:
            value = Уточняем остались ли вопросы
        Answer:
            mode = random
            key = Что-то еще
        intent: /SomethingElseYes || toState = "/SomethingElse/Yes", onlyThisState = true
        intent: /Нет || toState = "/SomethingElse/No", onlyThisState = true
        intentGroup: /KnowledgeBase/FAQ.Офтопик || toState = "/Offtopic"
        intentGroup: /KnowledgeBase/FAQ.FAQ || toState = "/FAQ"
        intentGroup: /KnowledgeBase/FAQ.Перевод на оператора || toState = "/TransferTriggers"

        state: Yes || noContext = true
            Answer:
                mode = random
                key = Что-то еще да

        state: No
            SetCallResult:
                value = Диалог завершен 
            go!: /GoodBye

    state: SomethingElseAfterFail
        Repeatable:
        Answer:
            mode = random
            key = Что-то еще после ошибки
        go: /SomethingElse

    state: GoodBye
        intent!: /Прощание
        SetAutomationStatus:
            value = true
        Answer:
            mode = random
            key = Прощание
        HangUp:

    state: HangUp
        event!: hangup
        event!: botHangup
        if: $session.lastState === "/GoodBye"
            SetScenarioAction:
                value = SuccessfulCall
        elseif: $session.lastState === "/TransferHandler/HangUp"
            SetScenarioAction:
                value = TransferedCall
        elseif: $request.event === "hangup" 
            SetScenarioAction:
                value = DisconnectedByClientCall
        else:
            SetScenarioAction:
                value = DisconnectedByBotCall


    state: Offtopic
        Repeatable:
        SetSessionTopicFAQ:
            value = 
        Answer:
            mode = random
            key = 
        go!: /SomethingElse

    state: FAQ
        Repeatable:
        SetSessionTopicFAQ:
            value = 
        SetAutomationStatus:
            value = true
        Answer:
            mode = random
            key =
        go!: /SomethingElse

    state: TransferTriggers
        Repeatable:
        SetSessionTopicFAQ:
            value = 
        SetAutomationStatus:
            value = true
        GetTransferReceiverByTopic:
        go!: /Transfer
    