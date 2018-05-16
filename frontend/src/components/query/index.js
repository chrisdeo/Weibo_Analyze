import React, { PureComponent } from 'react';
import { Input, Button, Table } from 'antd';
import classNames from 'classnames';
import axios from 'axios';
const InputGroup = Input.Group;

export default class SearchInput extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            focus: false,
            data: [],
            loading: false,
            selectedRowKeys: [],
            selectedRows: [],
        }
        this.columns = [{
            title:'用户ID',
            dataIndex:'UserID',
            key:'UserID',
            width:200
        },{
            title:'微博信息',
            dataIndex:'Content',
            key:'Content',
        }]
    }
    handleInputChange(e) {
        this.setState({
            value: e.target.value,
        });
    }
    handleFocusBlur(e) {
        this.setState({
            focus: e.target === document.activeElement,
        });
    }
    handleSearch() {
        if (this.onSearch) {
            this.onSearch(this.state.value);
        }
    }
    handleSubmit = () => {
        axios.get('/calSim', {
            params: {
                list: this.state.selectedRows,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }
    async onSearch(value) {
        let data = await axios.get('/vagueQuery', {
            params: {
                data: value,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        let i = 0;
        data.data.forEach((x)=>{
            x.key = i++;
        })
        this.setState({
            data:data.data
        })
    }
    onSelectChange(selectedRowKeys,selectedRows){
        this.setState({ selectedRows,selectedRowKeys });
        console.log(selectedRows)
        console.log(selectedRowKeys)
    }
    render() {
        const style = { width: 450 };
        const placeholder = '请输入查询范围';
        const btnCls = classNames({
            'ant-search-btn': true,
            'ant-search-btn-noempty': !!this.state.value.trim(),
        });
        const searchCls = classNames({
            'ant-search-input': true,
            'ant-search-input-focus': this.state.focus,
        });
        const rowSelection = {
            selectedRows,
            onChange: this.onSelectChange.bind(this),
        }
        const { loading, selectedRows } = this.state;
        return (
            <div>
                <div className="ant-search-input-wrapper" style={style}>
                    <InputGroup className={searchCls}>
                        <Input placeholder={placeholder} value={this.state.value} onChange={this.handleInputChange.bind(this)}
                            onFocus={this.handleFocusBlur.bind(this)} onBlur={this.handleFocusBlur.bind(this)} onPressEnter={this.handleSearch.bind(this)}
                        />
                        <div className="ant-input-group-wrap">
                            <Button icon="search" className={btnCls} onClick={this.handleSearch.bind(this)} />
                        </div>
                    </InputGroup>
                </div>
                <Button style={{ marginTop: 10, marginBottom: 10 }} type="primary" icon="check-circle" onClick={this.handleSubmit.bind(this)}>相关性分析</Button>
                <Table rowSelection={rowSelection} loading={this.state.loading} columns={this.columns} dataSource={this.state.data} />
            </div>
        );
    }
};

