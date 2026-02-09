import { useState } from 'react'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <header>
        <nav className='div1'>
          <button className='color'>Accueil</button>
          <button className='color'>A propos</button>
          <button className='color'>infos</button>
        </nav>

        <div className='div2'>
          <div className='right-box'>
            <p><strong>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere id, error mollitia magnam odio quaerat illo cum quos voluptatibus minima eveniet! Delectus nihil blanditiis incidunt at officia quam molestias illo.</strong></p>
            <p><strong>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repudiandae sit blanditiis beatae modi, deleniti, recusandae fugit dignissimos temporibus, ratione quaerat incidunt fugiat eum cumque! Adipisci fugit voluptatem architecto sint modi!</strong></p>
            <p><strong>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, numquam sed deserunt odio, voluptate laborum illo tenetur ad, ducimus animi omnis quaerat possimus tempora aliquid cumque eum exercitationem accusantium aut.</strong></p>
          </div>
        </div>

        <div>
          <div className='div3'>
            <h1 className='font'><strong>Schedule</strong></h1>
            <h1 className='font1'>App</h1>
          </div>
        </div>
      </header>

      <main>
        <div className='div5'>
          <div className='left-box'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim saepe praesentium, quaerat architecto explicabo natus nostrum fuga dignissimos optio sequi quas atque corporis reiciendis sint minima nemo. Dolores, laudantium ab?</div>
          <div className='div6'>
            <div>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Est maiores suscipit, dolores nam animi iure esse recusandae a officia porro cupiditate voluptas in voluptatum? Deserunt, ex exercitationem. Facilis, eius soluta!</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus laboriosam exercitationem debitis culpa aliquam sequi distinctio repellat minus quibusdam, voluptatum, voluptates eum illum fuga aspernatur praesentium, magnam iusto enim. Possimus!</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, minima? Suscipit inventore expedita recusandae illum odit id deserunt, tempore eaque, enim sit asperiores nihil provident, possimus eveniet assumenda quasi minus!</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci commodi iure quidem repudiandae. Quaerat, quo, blanditiis magnam, illo error non necessitatibus earum quibusdam incidunt suscipit amet! Veniam delectus possimus deserunt.</p>
            </div>
            <article>
              <button>Enseignant</button>
              <button>Admin</button>
            </article>
          </div>
        </div>
      </main>
    </div>
  )
}