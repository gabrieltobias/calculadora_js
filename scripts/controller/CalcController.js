class CalcController{
  //O método constructor serve para inicializar a classe
  constructor(){
    //Define como variaveis os elementos DOM do html
    // O _ serve p/ dizer que o atributo é private ou seja, serve somente para dentro da classe
    this._lastOperator = '';
    this._lastNumber = '';
    this._locale = 'pt-br';
    this._displayCalcEl = document.querySelector("#display");
    this._dateEl = document.querySelector("#data");
    this._timeEl = document.querySelector("#hora");
    this._currentDate;
    this._operation = [];
    this.initialize();
    this.initButtonsEvents();
    this.initKeyBoard();
  }
  //Metodo que executa sempre que é criada a classe
  initialize(){
    //Cria um método que muda a data e hora da tela
    this.setDisplayDateTime();
    //Executa esse método de 1 em 1 seg
    setInterval(()=>{
      this.setDisplayDateTime();
    },1000)

    this.setLastNumbertoDisplay();
  }
  //Evento para iniciar os comandos do teclado
  initKeyBoard(){
    document.addEventListener('keyup',e=>{
      console.log(e.key);
      switch (e.key) {
        case 'Escape':
        this.clearAll();
        break;
        case 'Backspace':
        this.clearEntry();
        break;
        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
        this.addOperation(e.key);
        break;
        case 'Enter':
        case '=':
        this.calc();
        break;
        case '.':
        case ',':
        this.addDot();
        break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        this.addOperation(parseInt(e.key));
        break;
      }
    });
  }

  //Funcao para pegar todos os eventos do mouse e interpretar no botao
  addEventListenerAll(element,events,fn){
    events.split(' ').forEach(event=>{
      element.addEventListener(event,fn,false);
    });
  }

  //Funcao para limpar as operações
  clearAll(){
    this._operation = [];
    this._lastNumber = '';
    this._lastOperator = '';
    this.setLastNumbertoDisplay();
  }
  //Função para limpar a ultima entrada
  clearEntry(){
    this._operation.pop();
    this.setLastNumbertoDisplay();
  }

  //Metodo para pegar a ultima posição de um array
  getLastOperation(){
    return this._operation[this._operation.length-1];
  }
  setLastOperation(value){
    return this._operation[this._operation.length-1] = value;
  }
  isOperator(value){
    //Verifica se o que foi digitado é um operador
    return (['+','-','*','/','%'].indexOf(value) > -1);
    //indexOf procura os valores citados no array e devolve o index, caso nao tenha nenhum devolve -1
  }

  pushOperation(value){
    this._operation.push(value);
    if(this._operation.length > 3){
      //let last = this._operation.pop();
      this.calc();
    }
  }
  getResult(){
    return eval(this._operation.join(""));
  }

  //Classe calc
  calc(){
    let last = '';

    this._lastOperator = this.getLastItem();

    if(this._operation.length<3){
      let firstItem = this._operation[0];
      this._operation = [firstItem,this._lastOperator, this._lastNumber];
    }

    if(this._operation.length > 3){
      last = this._operation.pop();
      this._lastNumber = this.getResult();
    }else if(this._operation.length==3){
      this._lastNumber = this.getLastItem(false);

    }

    let result = this.getResult();

    if(last == '%'){
      result /= 100;
      this._operation = [result];
    }else{
      this._operation = [result];
      if(last) this._operation.push(last);
    }
    this.setLastNumbertoDisplay();
  }

  getLastItem(isOperator = true){

    let lastItem;

    for (let i = this._operation.length-1; i >= 0; i--){

      if (this.isOperator(this._operation[i]) === isOperator) {

        lastItem = this._operation[i];
        break;

      }

    }

    return lastItem;

  }

  setLastNumbertoDisplay(){
    let lastNumber = this.getLastItem(false);
    if(!lastNumber) lastNumber = 0;
    this.displayCalc = lastNumber;
  }

  //Adicionar a operação ou numero
  addOperation(value){
    if(isNaN(this.getLastOperation())){
      //Se for string checa para ver se é um operador
      if(this.isOperator(value)){
        //Troca o operador
        this.setLastOperation(value);
      }else{
        this.pushOperation(value);
        this.setLastNumbertoDisplay();
      }
    }else{
      //Chec p/ ver se é um operador
      if (this.isOperator(value)){
        //Se for adiciona no array
        this.pushOperation(value);
      }else{
        //Se for um numero, converte para string e concatena com o ultimo digitado 1 + 2 = 12
        let newValue = this.getLastOperation().toString() + value.toString();
        //Adiciona o novo valor ao array
        this.setLastOperation(newValue);

        //Atualiza o display
        this.setLastNumbertoDisplay();
      }

    }
  }

  setError(){
    this.displayCalc = "error";
  }
  addDot(){
    //Cria uma variavel que recebe o que foi digitado
    let lastOperation = this.getLastOperation();
    //Verifica se a ultima operação é uma string e se ja possui ponto
    if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;
    //Caso seja um operador ou seja vazio apenas adiciona 0.
    if(this.isOperator(lastOperation)|| !lastOperation){
      this.pushOperation('0.');
      //Se nao, converte para string e adiciona o .
    }else{
      this.setLastOperation(lastOperation.toString() + '.');
    }
    this.setLastNumbertoDisplay();
  }
  execBtn(value){
    switch (value) {
      case 'ac':
      this.clearAll();
      break;
      case 'ce':
      this.clearEntry();
      break;
      case 'soma':
      this.addOperation('+');
      break;
      case 'subtracao':
      this.addOperation('-');
      break;
      case 'divisao':
      this.addOperation('/');
      break;
      case 'multiplicacao':
      this.addOperation('*');
      break;
      case 'porcento':
      this.addOperation('%');
      break;
      case 'igual':
      this.calc();
      break;
      case 'ponto':
      this.addDot();
      break;
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      this.addOperation(parseInt(value));
      break;
      default:
      this.setError();
      break;

    }
  }
  //Inicializa os botoes
  initButtonsEvents(){
    //Variavel com todos os DOM dos botoes
    let buttons = document.querySelectorAll("#buttons > g, #parts > g");
    buttons.forEach((btn,index)=>{
      //Adiciona uma acao para os eventos de click e drag
      this.addEventListenerAll(btn,"click drag",e=>{
        //TIra o btn- do nome
        let textBtn = btn.className.baseVal.replace("btn-","");

        this.execBtn(textBtn);
      });
      this.addEventListenerAll(btn,"mouseover mouseup mousedown",e=>{
        btn.style.cursor = "pointer";
      });
    });
  }

  setDisplayDateTime(){
    this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
      day:"2-digit",
      month:"long",
      year:"numeric"
    });
    this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
  }
  //Os métodos Getters e Setters permitem definir como acessar os valores GET pega e o SET muda o vaor
  //Get e set do display dos calculos
  get displayCalc(){
    return this._displayCalcEl.innerHTML;
  }
  set displayCalc(value){
    this._displayCalcEl.innerHTML = value;
  }
  //Get e set da data atual
  get currentDate(){
    return new Date();
  }
  set currentDate(value){
    this.currentDateEl.innerHTML = value;
  }
  //Get e Set do display da Data e hora
  get displayTime(){
    return this._timeEl.innerHTML;
  }
  set displayTime(value){
    this._timeEl.innerHTML = value;
  }
  get displayDate(){
    return this._dateEl.innerHTML;
  }
  set displayDate(value){
    this._dateEl.innerHTML = value;
  }


}
