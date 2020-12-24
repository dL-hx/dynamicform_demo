import React, {Component} from 'react';

/**
 * 找出数组对象中重复的项 放在一个新数组中
 * @param {*} data 要找的数组
 */
function getRepeatData(data) {
    let result=[];
    for (let i = 0; i < data.length; i++) {
        const el = data[i];
        for (let y = i+1; y < data.length; y++) {
            const val = data[y];
            if( el['value'] === val['value'] ) {
                result.push( el['value'])
            }
        }
    }
    return result
}

class DynamicForm extends Component {
    constructor(props) {
        super(props);
        let fileds = [...this.props.fileds]
        fileds = fileds.map(item=>(
            {
                value:item,
                isEdit:false
            }
        ))

        this.hasError = false
        this.hasErrorTip = ''

        this.state= {
            fileds: fileds
        }
    }

    handleInputChange = (index,e) => {
        const input = e.target.value
        const {fileds} = this.state

        console.log('input', input)
        fileds.some((item, key)=>{
            if (index == key){
                item.value = input
                return true
            }
        })

        this.setState({
            fileds: fileds
        });

    };


    edit = (index) => {
        const {fileds} = this.state
        fileds.some((item, key)=>{
            if (index == key){
                item.isEdit = true
                return true
            }
        })

        this.setState({
            fileds
        });
    };

    save = (index) => {
       if (this.hasError){
            alert(this.hasErrorTip)
            return;
        }

        const info = this.getFiledInfo()
        // console.log('info', info)

        this.props.onSave(info, ()=>{
            const {fileds} = this.state
            fileds.map((item, key)=>{
                item.isEdit = false
                return item
            })

            this.setState({
                fileds
            });
        })

    };

    getFiledInfo=()=>{
        let fileds = [...this.state.fileds]
        for(var i = 0 ;i<fileds.length;i++)
        {
            if(fileds[i].value == "" || typeof(fileds[i].value) == "undefined")
            {
                fileds.splice(i,1);
                i= i-1;
            }
        }

        return fileds.map(({value})=> value )
    }

    handleErrorFn = (value,duplicate) => {
        if (duplicate.includes(value)){// 有重复项
            return {
                checked:true,
                tip:'有重复项'
            }
        }

        if (value&&!/(http|https):\/\/([\w.]+\/?)\S*/.test(value)){// 格式校验不通过
            return {
                checked:true,
                tip:'http/https ,格式校验不通过'
            }
        }

        return {
            checked:false,
            tip:'成功校验'
        }
    };

    render() {
        const {fileds} = this.state

        const duplicate = getRepeatData(fileds) // 重复的数据
        return (
            <div>
                {
                    fileds.map((filed, index)=>{
                        const hasErrorObj= this.handleErrorFn(filed.value, duplicate)
                        this.hasError = hasErrorObj.checked
                        this.hasErrorTip = hasErrorObj.tip

                        return  <div key={index} style={{ display:'flex'}}>
                           {
                               filed.isEdit ?
                                   <span>
                                       <input placeholder="请输入..." style={{width: '60%'}} value={filed.value}
                                              onChange={this.handleInputChange.bind(this, index)}/>
                                       {
                                           filed.value==''?'':<span>{this.hasError?'失败':'成功'}</span>
                                       }

                                       {
                                           !this.hasError?'': <p style={{color: this.hasError?'#f00':"#0f0", fontSize:'12px'}}>{this.hasErrorTip}</p>
                                       }
                                   </span>
                                   :
                                   <span>
                                       {filed.value}
                                       {
                                           !this.hasError?'': <p style={{color: this.hasError?'#f00':"#0f0", fontSize:'12px'}}>{this.hasErrorTip}</p>
                                       }
                                   </span>
                           }

                           {filed.isEdit ? (
                               <button style={{height:'20px' }} onClick={this.save.bind(this, index)} >保存</button>
                           ) : <button style={{height:'20px' }} onClick={this.edit.bind(this, index)}>编辑</button>}

                       </div>
                    })
                }


            </div>
        );
    }


}

export default DynamicForm;

