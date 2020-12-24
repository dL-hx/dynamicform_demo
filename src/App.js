import React, {Component} from 'react';

import DynamicForm from "./dynamic_form";

class App extends Component {

    handleSave(value, successCb) {
        console.log('父组件', value)
        successCb() // 这里调用接口成功后, 可以使用调用该回调函数,更新input 状态
    }

    render() {
        return (
            <div>
                <DynamicForm fileds={['http://localhost:3000/','http://localhost:3001/','2','4']} onSave={this.handleSave} ref={(refs)=>this.df = refs}/>
            </div>
        );
    }
}

export default App;
