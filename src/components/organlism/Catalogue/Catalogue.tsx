export default async function Catalogue({slug}: {slug?: string}) {
    return(
        <div className="catalog-page">
            <h1>Catálogo</h1>
            <p>Slug: {slug}</p>
        </div>
    )
}