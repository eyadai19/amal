export default function home({ params }: { params: { id: string } }) {
	const x = params.id;
	return <div>{x}</div>;
}