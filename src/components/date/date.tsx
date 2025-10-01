type DateComponentProps = {
    date: Date;
}

export const DateComponent = ({ date }: DateComponentProps) => {
    return <span><DateIcon /> {formatDate(date)}</span>
}