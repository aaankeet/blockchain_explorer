import moment from "moment";
import styles from "@/styles/Home.module.css";

export default function SearchResults(props) {
  return (
    <div className={styles.searchResults}>
      <p className={styles.amountOfTx}>
        Latest 25 from a total of{" "}
        <span className={styles.blueText}>{props.result.result.length}</span>{" "}
        transactions
      </p>
      <table className={styles.txnSection}>
        <thead>
          <tr className={styles.txnTitle}>
            <th>Transaction hash</th>
            <th>Method</th>
            <th>Block</th>
            <th className={styles.blueText}>Age</th>
            <th>From</th>
            <th></th>
            <th>To</th>
            <th>Value</th>
            <th className={styles.blueText}>Txn Fee</th>
          </tr>
        </thead>
      </table>
      {props.result.result.map((tx) => {
        return (
          <tr className={styles.tx}>
            <td> {tx.hash.slice(0, 16)}... </td>
            <td>
              <span className={styles.transfer}>
                {tx.decoded_call ? tx.decoded_call.label : "Unknown"}
              </span>
            </td>
            <td className={styles.blueText}>{tx.block_number}</td>
            <td>{moment(tx.block_timestamp, "YYYYMMDD").fromNow()}</td>
            <td>
              {tx.from_address.slice(0, 8)}...{tx.from_address.slice(-4)}
            </td>
            <td>
              <span
                className={`${
                  tx.from_address.toLowerCase() !==
                  props.result.searchInput.toLowerCase()
                    ? styles.inTxn
                    : styles.outTxn
                }`}
              >
                {tx.from_address.toLowerCase() !==
                props.result.searchInput.toLowerCase()
                  ? "IN"
                  : "OUT"}
              </span>
            </td>
            <td className={styles.blueText}>
              {tx.to_address.slice(0, 8)}...{tx.to_address.slice(-4)}
            </td>
            <td>{(tx.value / 10 ** 18).toFixed(5)} ETH</td>
            <td>{(tx.gas_price / 10 ** 18).toFixed(12)}</td>
          </tr>
        );
      })}
    </div>
  );
}
