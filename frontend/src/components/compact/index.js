import React, { PureComponent } from 'react';
import { Table, Button } from 'antd';
import axios from 'axios';
export default class CompactInformation extends PureComponent {
    constructor(props) {
        super(props);
        // this.data = [];
        this.state = {
            data: [],
            loading: true,
            selectedRowKeys: [],
            selectedRows: [],
        };
        this.columns = [{
            title: '用户名称',
            dataIndex: 'Nickname',
            key: 'Nickname',
        }, {
            title: '用户ID',
            dataIndex: 'UserID',
            key: 'UserID',
            sorter: (a,b)=>a.UserID-b.UserID,
        }];
        this.data = [];

    }
    componentWillMount() {
        this.getPersonalList();
    }
    getPersonalList = async () => {
        const res = await axios.get('/getComList');
        let i = 0;
        res.data.forEach((x)=>{
            x.key = i++;
        })
        console.log(res.data)
        this.setState({
            data: res.data,
            loading: false,
        })
    }
    handleSubmit = () => {
        axios.get('/calCompact', {
            params: {
                list: this.state.selectedRows,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }
    onSelectChange(selectedRowKeys,selectedRows){
        this.setState({ selectedRows,selectedRowKeys });
        console.log(selectedRows)
        console.log(selectedRowKeys)
    }
    render() {
        const { loading, selectedRows } = this.state;
        const rowSelection = {
            selectedRows,
            onChange: this.onSelectChange.bind(this),
        }
        return (
            <div>
                    <Button style={{ marginTop: 10, marginBottom: 10 }} type="primary" icon="check-circle" onClick={this.handleSubmit.bind(this)}>紧密度计算</Button>
                    <Table rowSelection={rowSelection} loading={this.state.loading} columns={this.columns} dataSource={this.state.data} />
            </div>
        )
    }
}