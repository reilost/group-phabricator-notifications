const notifos = Array.from(
  document.querySelectorAll(
    '.phabricator-notification-list .phabricator-notification'
  )
).map(el => ({
  el,
  task: el.querySelector('.phui-handle:not(.phui-link-person)')
}));

const groups = notifos.reduce(
  (gs, n) => {
    let key = n.task.href;
    gs[key] = gs[key] || {
      title: n.task.textContent,
      href: key,
      children: []
    };
    gs[key].children.push(n);
    return gs;
  },
  {}
);

const notifoList = document.querySelector('.phabricator-notification-list');

notifoList.innerHTML = '';

Object.keys(groups).forEach((k, i) => {
  let group = groups[k];
  notifoList.appendChild(renderGroup(group, i));
});

function renderGroup(group, i) {
  const container = document.createElement('div');
  container.style.padding = '0.5em 1em';
  if (i % 2 == 0) container.style.backgroundColor = '#f5f5f5';
  container.innerHTML = `
    <h3 class='phui-header-header'>
      <span style='float: right;'>
        <span class="read visual-only phui-icon-view phui-font-fa fa-eye-slash" aria-hidden="true" style='cursor:pointer'></span>
        <span class='toggle' style='min-width: 50px; text-align: right; display: inline-block; cursor: pointer; font-weight: bold;'>${group.children.length} <span>◀︎</span></span>
      </span>
      <a href='${group.href}'></a>
    </h3>
    <div class='grouped-notifos' style='display: none; font-size: 0.8em;'>
    </div>
  `;
  // Set title as text content to avoid html injection
  container.querySelector('h3>a').textContent = group.title;

  const toggle = container.querySelector('.toggle');
  const toggleIcon = toggle.querySelector('span');
  const read = container.querySelector('.read');
  const grouped = container.querySelector('.grouped-notifos');

  read.addEventListener('click', () => {
    const i = document.createElement('img');
    i.src = group.href;
    container.remove();
  });

  toggle.addEventListener('click', () => {
    if (toggleIcon.textContent === '◀︎') {
      toggleIcon.textContent = '▼';
      grouped.style.display = 'block';
    } else {
      toggleIcon.textContent = '◀︎';
      grouped.style.display = 'none';
    }
  });

  group.children.forEach(n => grouped.appendChild(n.el.cloneNode(true)));

  return container;
}
