import React from "react";
import NumberFormat from 'react-number-format';
import "./NumberInput.css";
import Icon from "../Icon/Icon";


const NumberInput = (props) => {
    return (
        <div>
            <div className={`input-group ${props.customClass}`}>
                <span className="lead">{props.lead}</span>
                <NumberFormat
                    thousandSeparator={true}
                    allowNegative={false}
                    decimalScale={props.maxDecimal}
                    onChange={props.onchange}
                    isAllowed={props.isAllowed}
                    prefix={props.prefix}
                    value={props.value}
                />
                <span className="after">{props.after}</span>
            </div>
            {
                props.alert != null ?
                    <div className={`input-group-hint ${props.customClass}`}
                         data-html={true}
                         data-place="left"
                         data-effect="float"
                         data-tip={props.hint}
                    >
                        <Icon iconName="icon-info icon-white font-size-sm" customClass="hint-icon"/>
                        <span className="alert pr-05">{props.alert}</span>
                    </div>
                    :
                    ""
            }

        </div>
    )
}

export default NumberInput;