mod quadtree_module {

  enum Quad {
    Rant(Quadrant),
    Tree(Box<QuadTree>)
  }

  enum Directions {
    NE, SW, NW, SE
  }

  pub struct Quadrant {

    tree: &QuadTree,
    direction: Directions,
    depth: i32,
    max_depth: i32

  }

  pub struct QuadTree {
    
    ne: Option<Quad>,
    se: Option<Quad>,
    nw: Option<Quad>,
    sw: Option<Quad>,
    depth: i32,
    max_depth: i32

  }

  fn build_quadrant (tree: &QuadTree, direction: Directions, depth: i32, max_depth: i32) -> Option<Quad> {
    Some(Quad::Rant(Quadrant {
      depth,
      max_depth,
      direction,
      tree
    }))
  }

  pub fn build_quadtree (depth: i32, max_depth: i32) -> Box<QuadTree> {
    let mut tree = Box::new(QuadTree {
      depth,
      max_depth,
      ne: None,
      se: None,
      nw: None,
      sw: None
    });

      tree.ne = build_quadrant(&*tree, Directions::NE, depth, max_depth);
      tree.se = build_quadrant(&*tree, Directions::SE, depth, max_depth);
      tree.nw = build_quadrant(&*tree, Directions::NW, depth, max_depth);
      tree.sw = build_quadrant(&*tree, Directions::SW, depth, max_depth);
      
      return tree;
  }

  fn build_subtree (depth: i32, max_depth: i32) -> QuadTree {
    let mut tree = QuadTree {
      depth,
      max_depth,
      ne: None,
      se: None,
      nw: None,
      sw: None
    };

    tree.ne = build_quadrant(&tree, Directions::NE, depth, max_depth);
    tree.se = build_quadrant(&tree, Directions::SE, depth, max_depth);
    tree.nw = build_quadrant(&tree, Directions::NW, depth, max_depth);
    tree.sw = build_quadrant(&tree, Directions::SW, depth, max_depth);
    
    return tree;
  }

  impl QuadTree {

  }

  impl Quadrant {
    fn subdivide_ne (&self) {
      use web_sys::console;
      console::log_1(&"subdividing ne".into());
    }

    fn subdivide_se (&self) {
      use web_sys::console;
      console::log_1(&"subdividing se".into());
    }

    fn subdivide_nw (&self) {
      use web_sys::console;
      console::log_1(&"subdividing nw".into());
    }

    fn subdivide_sw (&self) {
      use web_sys::console;
      console::log_1(&"subdividing sw".into());
    }
  }

  impl Quadrant {

    fn subdivide (&self) {
      if self.depth >= self.max_depth {
        return
      }
      match self.direction {
        Directions::NE => {
          self.subdivide_ne();
        },
        Directions::SE => {
          self.subdivide_se();
        },
        Directions::NW => {
          self.subdivide_nw();
        },
        Directions::SW => {
          self.subdivide_sw();
        }
      }
    }
  }
}