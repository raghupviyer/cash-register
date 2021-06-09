import { useEffect, useState } from "react"
import {firebase} from '../firebase'

const useTransactions = () => {
  const [Transactions, setTransactions] = useState([])
  useEffect(() => {
    console.log('transactions fetched')
    firebase.firestore().collection('transactions').get().then(snapshot => {
      let allTransactions = []
      snapshot.forEach(doc => {
        allTransactions.push({
          amount: doc.data().amount,
          date: doc.data().date,
          remarks: doc.data().remarks,
          time: doc.data().time,
          type: doc.data().type,
        })
      })
      allTransactions = allTransactions.reverse()
      console.log(allTransactions)
      if(JSON.stringify(allTransactions) !== JSON.stringify(Transactions)){
        setTransactions(allTransactions)
      }
    })
  }, [Transactions])
  return{Transactions, setTransactions}
}

const useTotal = () => {
  const [total, setTotal] = useState(null)
  useEffect(() => {
    console.log('total fetched')
    firebase.firestore().collection('total').doc('k4xJWwsua9kpn7WxoaUp').get().then((doc) => {
      const newTotal = doc.data().total
      if(newTotal !== total){
        setTotal(newTotal)
      }
    })
  }, [total])
  return {total, setTotal}
}

export {useTransactions, useTotal}