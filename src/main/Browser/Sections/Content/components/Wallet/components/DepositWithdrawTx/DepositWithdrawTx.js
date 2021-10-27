import React, {Fragment, useState, useEffect, useRef} from "react";
import classes from "./DepositWithdrawTx.module.css";
import moment from "moment-jalaali";
import {connect, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {DTAllTransactionsData} from "../../../../../../../../FakeData/FakeData";
import ScrollBar from "../../../../../../../../components/ScrollBar";
import NumberInput from "../../../../../../../../components/NumberInput/NumberInput";
import TextInput from "../../../../../../../../components/TextInput/TextInput";
import Icon from "../../../../../../../../components/Icon/Icon";
import {useParams} from "react-router-dom";
import {getDeposit, getDepositAddress, getWithdraw} from "../../api/wallet";
import Loading from "../../../../../../../../components/Loading/Loading";
import Error from "../../../../../../../../components/Error/Error";
import LastTradesTable from "../../../Dashboard/components/LastTrades/components/LastTradesTable/LastTradesTable";

const DepositWithdrawTx = (props) => {
  const {t} = useTranslation();
  const [filterOpen, setFilterOpen] = useState(null);
  const [openItem, setOpenItem] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    fromTime: null,
    fromDate: null,
    toTime: null,
    toDate: null,
    type: null,
    address: null,
  });
  const {id} = useParams();
  const accessToken = useSelector(state => state.auth.accessToken);
  const [alert, setAlert] = useState({
    fromTime: null,
    fromDate: null,
    toTime: null,
    toDate: null,
  });
  const [tx, setTx] = useState(null);
  const [error, setError] = useState(false);

  function timeValidator(inputField, key) {
    const isValid = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/.test(inputField);
    if (isValid) {
      setAlert({...alert, [key]: null});
      setFilters({...filters, [key]: inputField});
    } else {
      setAlert({...alert, [key]: "ساعت وارد شده صحیح نمیباشد"});
    }
  }

  function dateValidator(inputField, key) {
    const isValid = /^[1-4]\d{3}\/((0[1-6]\/((3[0-1])|([1-2][0-9])|(0[1-9])))|((1[0-2]|(0[7-9]))\/(30|31|([1-2][0-9])|(0[1-9]))))$/.test(
      inputField,
    );
    if (isValid) {
      setAlert({...alert, [key]: null});
    } else {
      setAlert({...alert, [key]: "تاریخ وارد شده صحیح نمیباشد"});
    }
  }
  const options = [
    {value: "all", label: "همه"},
    {value: "deposit", label: "واریز"},
    {value: "withdraw", label: "برداشت"},
  ];


  const getTx = async () => {
    setError(false)
    let newTx = []
    const deposit = await getDeposit(accessToken ,id)
    if (deposit && deposit.status === 200 ){
      newTx = deposit.data.map((d)=>{
        d.time = d.insertTime
        d.isDeposit = true
        return d
      })
    } else {
      return setError(true)
    }

    const withdraw = await getWithdraw(accessToken ,id)
    if (withdraw && withdraw.status === 200 ){
      newTx = [...newTx , ...withdraw.data.map(w => {
        w.time = new Date(w.applyTime).getTime()
        w.isDeposit = false
        return w
      })]
    } else {
      return setError(true)
    }
    setTx(newTx.sort((a,b) => b.time - a.time))
  }

  useEffect(() => {
    setIsLoading(true)
    getTx().then(()=>{
      setIsLoading(false)
    })
  }, [id]);





  const content = () => {
    if(isLoading) {
      return <Loading/>
    }
    if (error) {
      return <Error/>
    }
    if( tx.length === 0) {
      return <div className="container height-100 flex ai-center jc-center font-size-sm">{t("noTx")}</div>
    }
    return  <ScrollBar>
      {filterOpen ? (
          <Fragment>
            <div className={classes.filterBox}>
              <NumberInput
                  lead="از ساعت"
                  after=<i className="icon-clock" />
              customClass={classes.filterInput}
              format="##:##"
              placeholder="HH:mm"
              mask={["H", "H", "m", "m"]}
              alert={alert.fromTime}
              onchange={(input) =>
                timeValidator(input.target.value, "fromTime")
            }
              />
              <NumberInput
                  lead="تاریخ"
                  after=<i className="icon-calendar-1" />
              customClass={classes.filterInput}
              format="####/##/##"
              placeholder="YYYY/MM/DD"
              mask={["Y", "Y", "Y", "Y", "M", "M", "D", "D"]}
              alert={alert.fromDate}
              onchange={(input) =>
                dateValidator(input.target.value, "fromDate")
            }
              />
              <NumberInput
                  lead="تا ساعت"
                  after=<i className="icon-clock" />
              customClass={classes.filterInput}
              format="##:##"
              placeholder="HH:mm"
              mask={["H", "H", "m", "m"]}
              alert={alert.toTime}
              onchange={(input) =>
                timeValidator(input.target.value, "toTime")
            }
              />
              <NumberInput
                  lead="تاریخ"
                  after=<i className="icon-calendar-1" />
              customClass={classes.filterInput}
              format="####/##/##"
              placeholder="YYYY/MM/DD"
              mask={["Y", "Y", "Y", "Y", "M", "M", "D", "D"]}
              alert={alert.toDate}
              onchange={(input) =>
                dateValidator(input.target.value, "toDate")
            }
              />
            </div>
            <div className={classes.filterBox}>
              <TextInput
                  select={true}
                  placeholder="نوع تراکنش"
                  options={options}
                  value={filters.type}
                  lead="نوع تراکنش"
                  customClass={classes.filterInput}
                  onchange={(e) => setFilters({...filters, type: e.value})}
              />
              <TextInput
                  placeholder=" آدرس مبدا/مقصد را وارد کنید"
                  options={options}
                  value={filters.address}
                  lead="مبدا/مقصد"
                  customClass={`${classes.filterInput} ${classes.address}`}
                  onchange={(e) =>
                      setFilters({...filters, address: e.target.value})
                  }
              />
            </div>
            <div className={classes.btnBox}>
              <button
                  className={`${classes.button} ${classes.submit} cursor-pointer`}
                  onClick={() => setFilterOpen((prev) => !prev)}>
                اعمال فیلتر
              </button>
              <button
                  className={`${classes.button} ${classes.reset} cursor-pointer`}
                  onClick={() => setFilterOpen((prev) => !prev)}>
                حذف فیلتر
              </button>
              <button
                  className={`${classes.button} ${classes.return} cursor-pointer`}
                  onClick={() => setFilterOpen((prev) => !prev)}>
                بازگشت
              </button>
            </div>
          </Fragment>
      ) : (
          <table
              className="text-center double-striped"
              cellSpacing="0"
              cellPadding="0">
            <thead className="th-border-y">
            <tr>
              <th>{t("date")}</th>
              <th>{t("time")}</th>
              <th>{t("DepositWithdrawTx.transactionType")}</th>
              {/*<th>{t("destination")}</th>*/}
              <th>{t("volume")} ({id})</th>
              <th className={`width-23`}>{t("DepositWithdrawTx.inventory")} ({id})</th>
              <th>{t("status")}</th>
              <th>{t("details")}</th>
            </tr>
            </thead>
            <tbody>{tx.map((tr, index) => (
                <Fragment key={index}>
                  <tr className={tr.isDeposit === true ? "text-green" : "text-red"}>
                    <td>{moment(tr.time).format("jYY/jMM/jDD")}</td>
                    <td>{moment(tr.time).format("HH:mm:ss")}</td>
                    <td>{tr.isDeposit === true ? t("deposit") : t("withdrawal")}</td>
                    {/*<td className="direction-ltr">{tr.destination}</td>*/}
                    <td>
                      {tr.amount}{" "}
                      {tr.isDeposit === true
                          ? "+"
                          : "-"}
                    </td>
                    <td>{tr.amount}</td>
                    <td>{t("ordersStatus.FILLED")}</td>
                    {openItem === index ? (
                        <td onClick={() => setOpenItem(null)}>
                          <Icon
                              iconName="icon-up-open icon-blue font-size-sm cursor-pointer"
                              customClass={classes.iconBG}
                          />
                        </td>
                    ) : (
                        <td onClick={() => setOpenItem(index)}>
                          <Icon
                              iconName="icon-down-open icon-blue font-size-sm cursor-pointer"
                              customClass={classes.iconBG}
                          />
                        </td>
                    )}
                  </tr>
                  <tr
                      style={{display: openItem === index ? "revert" : "none"}}>
                    <td colSpan="9" className={`py-1 px-2`}>
                      <div className="row jc-around  ai-center" style={{width: "100%"}}>
                        <p className="col-46 row jc-between">
                          {t("DepositWithdrawTx.destination")} :{" "}
                          <span>{tr.address}</span>
                        </p>
                        <p className="col-46 row jc-between">
                          {t("DepositWithdrawTx.network")} :{" "}
                          <span>{tr.network}</span>
                        </p>
                      </div>
                      <div className="row jc-around  ai-center" style={{width: "100%"}}>
                        <p className="col-96 row jc-between">
                          {t("DepositWithdrawTx.transactionId")} :{" "}
                          <span>{tr.txId}</span>
                        </p>
                        {/*<p className="col-46 row jc-between">
                            {t("DepositWithdrawTx.blockchainTransactionId")} :{" "}
                            <span>{tr.blockchainTransactionId}</span>
                          </p>*/}
                      </div>
                    </td>
                  </tr>
                </Fragment>
            ))}
            </tbody>

          </table>
      )}
    </ScrollBar>


  }




  return (
      <div className={`container card-background card-border column ${classes.container} my-2`}>
        <div className="flex jc-between card-header-bg py-2 px-1">
          <h3>{t("DepositWithdrawTx.title")}</h3>
          <div className="row jc-center ai-center">
            {/*<span
              style={{color: "var(--bgGreen)"}}
              className="font-size-md-plus cursor-pointer">
              <i className="icon-microsoft_excel flex" />
            </span>*/}
            {/*<span
              style={{color: "var(--orange)"}}
              className="font-size-md-plus  cursor-pointer"
              onClick={() => setFilterOpen((prev) => !prev)}>
              <i className="icon-filter flex" />
            </span>*/}
          </div>
        </div>
        {content()}
      </div>
  );
};

const mapStateToProps = (state) => {
  return {
    activePair: state.global.activePair,
  };
};

export default connect(mapStateToProps, null)(DepositWithdrawTx);
