import { AppBar, Button, FormControl, InputLabel, MenuItem, Select, TextField, Toolbar, Typography, List, ListItem, ListItemText, Divider, ListItemSecondaryAction } from '@material-ui/core';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import './App.css';
import {firebase} from './firebase'
import { useTransactions, useTotal } from './hooks';

function App() {
  const [transactionType, setTransactionType] = useState(true)
  const [remarks, setRemarks] = useState("")
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date())
  const {Transactions, setTransactions} = useTransactions()
  const {total, setTotal} = useTotal()

  const Validate = () => {
    if((amount > total) && (transactionType === false)){
      throw new Error("You Dont Have enough Money to Give")
    }
    else if (amount === ''){
      throw new Error("amount canot be null")
    }
    else if(remarks === ''){
      throw new Error("remarks cannot be null")
    }
  }

  const typeChange = (event) => {
    setTransactionType(event.target.value);
  };

  const addTransfer = () => {
    try{
      Validate()
      firebase.firestore().collection('transactions').add({
        amount,
        date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
        remarks,
        time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        type: transactionType,
      }).then(() => {
        setAmount('')
        setRemarks('')
        firebase.firestore().collection('total').doc('k4xJWwsua9kpn7WxoaUp').update({total: transactionType? total + amount : total - amount})
        setTotal()
        setTransactions([])
      })
    }catch (e){
      alert(e)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setDate(new Date())
    }, 1000)
  }, [date])

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Cash Register
          </Typography>
        </Toolbar>
      </AppBar>
    <SDiv>
        <TextField label="Amount" variant="outlined" type="number" value={amount} onChange={(e)=> setAmount(parseInt(e.target.value))} required/> <br />
        <TextField label="Remarks" variant="outlined" value={remarks} onChange={(e)=> setRemarks(e.target.value)} required/> <br />
        <FormControl>
          <InputLabel>Type</InputLabel>
          <Select
            value={transactionType}
            onChange={typeChange}
          >
            <MenuItem value={true}>Receive</MenuItem>
            <MenuItem value={false}>Give</MenuItem>
          </Select>
        </FormControl> <br />
        <Button color="primary" variant="contained" onClick={addTransfer}>Transfer Money</Button>
        <div className="total">Total: {total}</div>

        {Transactions.map(transaction => (
          <List component="nav" >
            <ListItem button>
              <ListItemText primary={transaction.remarks} secondary={transaction.date}/>
            </ListItem>
            <ListItemSecondaryAction>
              {`${transaction.type? '+' : '-'} ${transaction.amount}`}
            </ListItemSecondaryAction>
            <Divider />
          </List>
        ))}
    </SDiv>
    </>
  );
}

export default App;


const SDiv = styled.div`
  display: grid;
  justify-content: center;
  margin-top: 2rem;
  .total{
    text-align: center;
    padding: 1rem;
    border: 1px solid rgba(0,0,0,0.3);
    border-radius: 4px;
    margin-top: 1rem;
  }
`