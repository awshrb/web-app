import {useQuery} from "@tanstack/react-query";
import {getIPGDeposit} from "js-api-client";

export const useIPGDeposit = () => {
    return useQuery(
        ['IPGDepositTxs'], getIPGDepositFunc,
        {
            retry: 1,
            notifyOnChangeProps: ['data', 'isLoading', 'error']
        });
}

const getIPGDepositFunc = async () => {
    const {data} = await getIPGDeposit()
    return data;
}
