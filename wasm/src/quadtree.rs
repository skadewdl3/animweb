pub struct QuadTree {
  ne: Option<SubTree>,
  se: Option<SubTree>,
  nw: Option<SubTree>,
  sw: Option<SubTree>
}

pub struct SubTree {
  ne: Option<Quad>,
  se: Option<Quad>,
  nw: Option<Quad>,
  sw: Option<Quad>
}

pub struct Contour {
  x1: f32,
  y1: f32,
  x2: f32,
  y2: f32
}

pub struct QuadRant {
  binary: u8,
  contour: Contour
}

pub enum Quad {
  Tree(Box<SubTree>),
  Rant(QuadRant)
}

pub fn subdivide_subtree (subtree: &mut SubTree, depth: u32, min_depth: u32) {
  if depth > min_depth {
    let ne_tree = Box::new(SubTree {
      ne: None,
      se: None,
      nw: None,
      sw: None
    });
    subtree.ne = Some(Quad::Tree(ne_tree));
    if let Some(ne) = &mut subtree.ne {
        match ne {
          Quad::Tree(ne_tree) => subdivide_subtree(ne_tree, depth + 1, min_depth),
          _ => ()
        }

    }
    let se_tree = Box::new(SubTree {
      ne: None,
      se: None,
      nw: None,
      sw: None
    });
    subtree.se = Some(Quad::Tree(se_tree));
    if let Some(se) = &mut subtree.se {
        match se {
          Quad::Tree(se_tree) => subdivide_subtree(se_tree, depth + 1, min_depth),
          _ => ()
        }

    }
    let nw_tree = Box::new(SubTree {
      ne: None,
      se: None,
      nw: None,
      sw: None
    });
    subtree.nw = Some(Quad::Tree(nw_tree));
    if let Some(nw) = &mut subtree.nw {
        match nw {
          Quad::Tree(nw_tree) => subdivide_subtree(nw_tree, depth + 1, min_depth),
          _ => ()
        }

    }
    let sw_tree = Box::new(SubTree {
      ne: None,
      se: None,
      nw: None,
      sw: None
    });
    subtree.sw = Some(Quad::Tree(sw_tree));
    if let Some(sw) = &mut subtree.sw {
        match sw {
          Quad::Tree(sw_tree) => subdivide_subtree(sw_tree, depth + 1, min_depth),
          _ => ()
        }

    }
  } else {
    subtree.ne = Some(Quad::Rant(QuadRant {
      binary: 0,
      contour: Contour {
        x1: 0.0,
        y1: 0.0,
        x2: 0.0,
        y2: 0.0
      }
    }));
    subtree.se = Some(Quad::Rant(QuadRant {
      binary: 0,
      contour: Contour {
        x1: 0.0,
        y1: 0.0,
        x2: 0.0,
        y2: 0.0
      }
    }));
    subtree.nw = Some(Quad::Rant(QuadRant {
      binary: 0,
      contour: Contour {
        x1: 0.0,
        y1: 0.0,
        x2: 0.0,
        y2: 0.0
      }
    }));
    subtree.sw = Some(Quad::Rant(QuadRant {
      binary: 0,
      contour: Contour {
        x1: 0.0,
        y1: 0.0,
        x2: 0.0,
        y2: 0.0
      }
    }));
  }
}

pub fn subdivide (quadtree: &mut QuadTree, min_depth: u32, max_depth: u32) {
    quadtree.ne = Some(SubTree {
      ne: None,
      se: None,
      nw: None,
      sw: None
    });
    if let Some(ne) = &mut quadtree.ne {
      subdivide_subtree(ne, 1, min_depth);
    }
    quadtree.se = Some(SubTree {
      ne: None,
      se: None,
      nw: None,
      sw: None
    });
    if let Some(se) = &mut quadtree.se {
      subdivide_subtree(se, 1, min_depth);
    }
    quadtree.nw = Some(SubTree {
      ne: None,
      se: None,
      nw: None,
      sw: None
    });
    if let Some(nw) = &mut quadtree.nw {
      subdivide_subtree(nw, 1, min_depth);
    }
    quadtree.sw = Some(SubTree {
      ne: None,
      se: None,
      nw: None,
      sw: None
    });
    if let Some(sw) = &mut quadtree.sw {
      subdivide_subtree(sw, 1, min_depth);
  } 
}


pub fn build_quadtree () -> QuadTree {
  let mut quadtree = QuadTree {
    ne: None,
    se: None,
    nw: None,
    sw: None
  };
  subdivide(&mut quadtree, 6, 8);
  return quadtree;
}